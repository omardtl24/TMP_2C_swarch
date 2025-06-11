import 'package:flutter/material.dart';

// Paleta Primary
const Map<int, Color> primaryShades = {
  0: Color(0xFF000000),
  5: Color(0xFF160041),
  10: Color(0xFF22005D),
  20: Color(0xFF3A0092),
  25: Color(0xFF4700AF),
  30: Color(0xFF5400CC),
  35: Color(0xFF6102E9),
  40: Color(0xFF6E26F5),
  50: Color(0xFF8653FF), // base
  60: Color(0xFF9E79FF),
  70: Color(0xFFB69BFF),
  80: Color(0xFFCFBCFF),
  90: Color(0xFFE9DDFF),
  95: Color(0xFFF6EEFF),
  98: Color(0xFFFDF7FF),
  99: Color(0xFFFFFBFF),
  100: Color(0xFFFFFFFF),
};

const MaterialColor primarySwatch = MaterialColor(0xFF8653FF, {
  50: Color(0xFFE9DDFF),
  100: Color(0xFFF6EEFF),
  200: Color(0xFFCFBCFF),
  300: Color(0xFFB69BFF),
  400: Color(0xFF9E79FF),
  500: Color(0xFF8653FF),
  600: Color(0xFF6E26F5),
  700: Color(0xFF5400CC),
  800: Color(0xFF3A0092),
  900: Color(0xFF22005D),
});

// Paleta Secondary
const Map<int, Color> secondaryShades = {
  5: Color(0xFF001126),
  10: Color(0xFF001C38),
  20: Color(0xFF00325B),
  30: Color(0xFF004880),
  40: Color(0xFF0060A8),
  50: Color(0xFF0279D1),
  60: Color(0xFF3A94ED),
  70: Color(0xFF6AAFFF),
  80: Color(0xFFA1C9FF),
  90: Color(0xFFD3E4FF),
  95: Color(0xFFEAF1FF),
};

// Paleta Terciary
const Map<int, Color> tertiaryShades = {
  5: Color(0xFF2B0013),
  10: Color(0xFF3E001E),
  20: Color(0xFF650034),
  30: Color(0xFF8E004C),
  40: Color(0xFFB51465),
  50: Color(0xFFD6357E),
  60: Color(0xFFF85198),
  70: Color(0xFFFF83B0),
  80: Color(0xFFFFB0C9),
  90: Color(0xFFFFD9E3),
  95: Color(0xFFFFECF0),
};


final ThemeData customTheme = ThemeData(
  useMaterial3: true,
  primarySwatch: primarySwatch,
  colorScheme: ColorScheme(
    brightness: Brightness.light,
    primary: primaryShades[50]!, // 8653FF
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: primaryShades[90]!, // E9DDFF
    onPrimaryContainer: Color(0xFF201047),
    secondary: secondaryShades[50]!, // 0279D1
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: secondaryShades[90]!,
    onSecondaryContainer: secondaryShades[10]!,
    tertiary: tertiaryShades[50]!, // D6357E
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: tertiaryShades[90]!,
    onTertiaryContainer: tertiaryShades[10]!,
    error: Color(0xFFBA1A1A),
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFFDAD6),
    onErrorContainer: Color(0xFF410002),
    surface: primaryShades[98]!,
    onSurface: Color(0xFF1D1B20),
  ),
  scaffoldBackgroundColor: primaryShades[98],
);
