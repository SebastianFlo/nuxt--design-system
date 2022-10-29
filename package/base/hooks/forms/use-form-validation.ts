import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  Ref,
  watch,
} from '@nuxtjs/composition-api';
import { ApiError } from '../../helpers/api.helpers';
import { camelToSnakeCase } from '../../helpers/string.helpers';
import { useDatasource } from '../use-datasource';

type FormControl = HTMLInputElement | HTMLSelectElement;

// Lookup of error names and which fields to place them in.
// use the value 'default', if you don't have a specific field to show the error on.
type ErrorFieldLookup = { [errorName: string]: string };

interface ErrorMessage {
  name: string;
  value: string;
}

export const checkFormValidity = (form: HTMLFormElement | null) => {
  const isFormValid = ref(true);

  if (!form) {
    return false;
  }

  const validateFormControl = (formControl: FormControl) => {
    const name = formControl.name;
    if (!name) {
      return false;
    }

    return formControl.validity.valid;
  };

  for (const element of Array.from(form.elements)) {
    isFormValid.value =
      !isFormValid.value || validateFormControl(element as FormControl);
    if (!isFormValid.value) {
      return isFormValid.value;
    }
  }

  return isFormValid.value;
};

export function useFormValidation(
  form: Ref<HTMLFormElement | null>,
  options?: {
    regionOverride?: string;
    errorFieldLookup?: ErrorFieldLookup;
    errorMessages?: ErrorMessage[];
  },
) {
  const { dataSource: sharedErrorMessages } = useDatasource(
    'error-messages',
    options,
  );
  const errorFieldLookup = ref<ErrorFieldLookup>(
    options?.errorFieldLookup ?? {},
  );
  const customErrorMessages = ref<ErrorMessage[]>(options?.errorMessages ?? []);

  const errorMessages = computed(() => {
    const lookup = {};
    for (const item of sharedErrorMessages?.value ?? []) {
      lookup[item.name] = item.dimension_value || item.value || item.name;
    }
    for (const item of customErrorMessages.value) {
      lookup[item.name] = item.value || item.name;
    }
    return lookup;
  });

  const formErrors = ref<{ [field: string]: string[] | undefined }>({});
  const isFormValid = computed(
    () => !Object.values(formErrors.value).some((errors) => errors?.length),
  );

  // Adds custom error messages ex. for api errors.
  const addErrorMessages = (items: ErrorMessage[]) => {
    customErrorMessages.value = [...customErrorMessages.value, ...items];
  };

  const validateFormControl = (formControl: FormControl) => {
    const name = formControl.name;
    if (!name) {
      return;
    }

    const errors = getFormContolErrors(formControl, errorMessages.value ?? []);

    formErrors.value = {
      ...formErrors.value,
      [name]: errors.length ? errors : undefined,
    };
  };

  const clearFormControlErrors = (formControl: FormControl) => {
    const name = formControl.name;
    if (!name) {
      return;
    }

    formErrors.value = {
      ...formErrors.value,
      [name]: [],
    };
  };

  // Validate the form and all controls
  const validateForm = () => {
    if (!form.value) {
      return false;
    }

    clearFormErrors();

    for (const element of Array.from(form.value.elements)) {
      validateFormControl(element as FormControl);
    }

    return isFormValid.value;
  };

  const clearFormErrors = () => {
    formErrors.value = {};
  };

  // Sets a custom form control error unrelated to the native client side form validation.
  // Use the "customField" param if the field cannot be inferred from the error, or if an override is needed.
  const setFormControlError = (
    error: ApiError | Error | string,
    customField?: string,
  ) => {
    const field =
      customField ?? getErrorField(error, errorFieldLookup.value) ?? 'default';
    const message = getErrorMessage(field, error, errorMessages.value);

    formErrors.value = {
      ...formErrors.value,
      [field]: [...(formErrors.value[field] ?? []), message],
    };

    // when setting the error from outside, focus the invalid element.
    focusFirstError();
  };

  // Focuses the first error in the form.
  // useful when validating the form from api later,
  // where the user has made other field/button interactions
  // and needs to be navigated back to the invalid field.
  const focusFirstError = () => {
    if (!form.value) {
      return;
    }

    const firstError = Object.entries(formErrors.value).find(
      ([_key, value]) => !!value?.length,
    );

    if (firstError) {
      const control = form.value.elements.namedItem(
        firstError[0],
      ) as HTMLElement | null;
      control?.focus();
    }
  };

  // clear input form errors when entering a new value.
  const inputHandler = (event: Event) => {
    const formControl = event.target as FormControl;

    if (form.value && Array.from(form.value.elements).includes(formControl)) {
      clearFormControlErrors(formControl);
    }
  };

  // validate input when navigating out of it.
  const blurHandler = (event: Event) => {
    const formControl = event.target as FormControl;

    if (form.value && Array.from(form.value.elements).includes(formControl)) {
      validateFormControl(formControl);
    }
  };

  onMounted(() => {
    watch(
      form,
      (value) => {
        formErrors.value = {};

        if (value) {
          form.value?.addEventListener('input', inputHandler);
          form.value?.addEventListener('focusout', blurHandler);
        } else {
          form.value?.removeEventListener('input', inputHandler);
          form.value?.removeEventListener('focusout', blurHandler);
        }
      },
      { immediate: true },
    );
  });

  onUnmounted(() => {
    form.value?.removeEventListener('input', inputHandler);
    form.value?.removeEventListener('focusout', blurHandler);
  });

  return {
    formErrors,
    isFormValid,

    validateForm,
    validateFormControl,
    setFormControlError,
    clearFormErrors,
    addErrorMessages,
  };
}

// Gets the client side form control errors, based on standard client side validation.
// Keyed against validity state: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
function getFormContolErrors(
  formControl: FormControl,
  errorMessages: { [key: string]: string },
) {
  const errors: string[] = [];
  if (formControl.validity.valid) {
    return [];
  }

  for (const validityKey in formControl.validity) {
    // We only want specific errors, not the general "valid" state
    const validityState = formControl.validity[validityKey];
    if (validityKey === 'valid' || !validityState) {
      continue;
    }

    const error = getErrorMessage(formControl.name, validityKey, errorMessages);
    errors.push(error);
  }

  return errors;
}

// Gets the name that best describes the error that occurred,
// falling back to the full message of the error.
function getErrorName(error: ApiError | Error | string) {
  if (error instanceof ApiError) {
    const detail = error.errors[0];
    return detail?.type ?? error.status;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error;
}

// Gets the field to put the error next to.
function getErrorField(
  error: ApiError | Error | string,
  lookup: { [key: string]: string },
) {
  const name = getErrorName(error);

  if (lookup[name]) {
    return lookup[name];
  }

  if (error instanceof ApiError && error.errors.length) {
    return error.errors[0].field;
  }

  return null;
}

// Gets the error message based on a prioritised list of keys.
// Ex:
//   .firstname_value_missing ->
//   .value_missing ->
//   'value missing' -|
function getErrorMessage(
  field: string,
  error: ApiError | Error | string,
  errorMessages: { [key: string]: string },
) {
  const name = getErrorName(error);
  const nameFormatted = camelToSnakeCase(name);
  const fieldFormatted = camelToSnakeCase(field);
  const fullName = `${fieldFormatted}_${nameFormatted}`;

  if (errorMessages[fullName]) {
    return errorMessages[fullName];
  }

  if (errorMessages[nameFormatted]) {
    return errorMessages[nameFormatted];
  }

  // If we have an ApiError here, there is a good chance the backend has put
  // a readable (english) error message in there.
  if (error instanceof ApiError && error.errors[0]) {
    return error.errors[0].message;
  }

  // Ideally we should not land in this case with no error message,
  // but displaying something slightly readable is better than nothing.
  return nameFormatted.split('_').join(' ');
}
