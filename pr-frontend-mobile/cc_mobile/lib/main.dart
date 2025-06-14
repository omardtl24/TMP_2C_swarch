import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/stats_screen.dart';
import 'screens/register_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'utils/session.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: "assets/.env");
    print('Variables de entorno cargadas correctamente');
  } catch (e) {
    print('Error loading .env file: $e');
  }
 

  final session = Session();
  await session.loadSession();

  runApp(
    ChangeNotifierProvider(
      create: (_) => session,
      child: MyApp(),
    ),
  );
}


class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'cc_mobile',
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(),
        '/stats': (context) => StatsScreen(),
        '/register': (context) => RegisterScreen(key: const ValueKey('register_screen')),
      },
    );
  }
}
