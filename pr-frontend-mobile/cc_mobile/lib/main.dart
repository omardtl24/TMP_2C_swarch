import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/stats_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


void main() async {
  // Inicializar Flutter antes de operaciones asíncronas
  WidgetsFlutterBinding.ensureInitialized();
  
 
    
    // Intento 1: Ruta relativa desde lib
    try {
      await dotenv.load(fileName: "assets/.env");
      print("Loaded from 'assets/.env'");
    } catch (e) {
      print("Failed to load from'assets/.env': $e");
    }
    
    // Intento 2: Cargar desde la raíz del proyecto
   
  
  runApp(MyApp());
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
      },
    );
  }
}
