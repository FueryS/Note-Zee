import * as Haptics from "expo-haptics";

export function triggerHapticByValue(level) {
  switch (level) {
    case 1:
      // A tiny, sharp, barely noticeable pulse.
      // Feels like a microscopic tap or a light software tick.
      Haptics.selectionAsync();
      break;
    case 2:
      // A crisp, subtle tap.
      // Feels like tapping a small physical switch or moving a slider tick.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 3:
      // A solid, satisfying thud.
      // Feels like a mechanical keyboard keypress or a standard button click.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 4:
      // A heavy, forceful thud.
      // Feels like hitting a hard boundary, dropping a heavy UI element, or a firm knock.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 5:
      // Two quick, distinct pulses.
      // Gives an assertive "Task Completed Successfully" sensation.
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    default:
      // Fallback default for any unmapped whole numbers.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
  }
}
