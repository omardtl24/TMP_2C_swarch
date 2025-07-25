import 'package:cc_mobile/screens/event_screen.dart';
import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'utils/session.dart';
import 'dart:io';

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? ctx) {
    final client = super.createHttpClient(ctx);
    client.badCertificateCallback =
      (X509Certificate cert, String host, int port) => true;
    return client;
  }
}


void main() async {
 
  WidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = MyHttpOverrides();

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
        '/event': (context) => EventScreen(),
        '/register': (context) => RegisterScreen(key: const ValueKey('register_screen')),
      },
    );
  }
}
