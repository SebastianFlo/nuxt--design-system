export interface Tag {
  title: string;
  description: string;
  image:
    | 'LOW-IN-CALORIES'
    | 'LOW-IN-CARBS'
    | 'HIGH-IN-FIBER'
    | 'HIGH-IN-PROTEIN'
    | 'PROTEIN-RICH'
    | 'FAMILY-FRIENDLY'
    | 'NATURAL-FIBER'
    | 'SPANISH'
    | 'ITALIAN'
    | 'JAPANESE'
    | 'CHINESE'
    | 'MEXICAN'
    | 'VIETNAMESE'
    | 'GREEK'
    | 'MAROCCAN'
    | 'THAI'
    | 'INDIAN'
    | 'KOREAN'
    | 'ASIAN'
    | 'ARABIC'
    | 'MIDDLE-EASTERN'
    | 'PAKISTANI'
    | 'AMERICAN'
    | 'MEDITERRANEAN'
    | 'NORDIC'
    | 'SOUTH-AMERICAN'
    | 'SOUTHERN'
    | 'POTATOES-IN-SEASON'
    | 'ASPARAGUS-IN-SEASON'
    | 'PEAS-IN-SEASON'
    | 'RHUBARB-IN-SEASON'
    | 'CARROTS-IN-SEASON'
    | 'CORN-IN-SEASON'
    | 'APPLES-IN-SEASON';
}

export function getTagIcon(icon: Tag['image']): string {
  switch (icon?.toUpperCase() ?? '') {
    case 'LOW-IN-CARBS':
      return 'carbs.svg';
    case 'NATURAL-FIBER':
    case 'HIGH-IN-FIBER':
      return 'fiber.svg';
    case 'PROTEIN-RICH':
    case 'HIGH-IN-PROTEIN':
      return 'protein.svg';
    case 'LOW-IN-CALORIES':
      return 'calories.svg';
    case 'FAMILY-FRIENDLY':
      return 'family.svg';
    case 'SPANISH':
    case 'ITALIAN':
    case 'JAPANESE':
    case 'CHINESE':
    case 'MEXICAN':
    case 'VIETNAMESE':
    case 'GREEK':
    case 'MAROCCAN':
    case 'THAI':
    case 'INDIAN':
    case 'KOREAN':
    case 'ASIAN':
    case 'MIDDLE-EASTERN':
    case 'PAKISTANI':
    case 'AMERICAN':
    case 'MEDITERRANEAN':
    case 'NORDIC':
    case 'SOUTH-AMERICAN':
    case 'SOUTHERN':
    case 'ARABIC':
      return 'region.svg';
    case 'POTATOES-IN-SEASON':
      return 'potatoes.svg';
    case 'ASPARAGUS-IN-SEASON':
      return 'asparagus.svg';
    case 'PEAS-IN-SEASON':
      return 'peas.svg';
    case 'RHUBARB-IN-SEASON':
      return 'rhubarbs.svg';
    case 'CARROTS-IN-SEASON':
      return 'carrot.svg';
    case 'CORN-IN-SEASON':
      return 'corn.svg';
    case 'APPLES-IN-SEASON':
      return 'apple.svg';
    default:
      return 'information-icon.svg';
  }
}
