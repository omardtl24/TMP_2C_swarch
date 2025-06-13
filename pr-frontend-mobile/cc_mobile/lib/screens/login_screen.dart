import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../repository/google_auth_repository.dart';
import '../utils/session.dart';
import '../services/auth_service.dart';
import '../utils/secure_storage.dart';
class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    void handleLogin() async {
      final authRepository = GoogleAuthRepository(authService: AuthService());
      final user = await authRepository.signInWithGoogle();
      final jwt = await SecureStorage.instance.read(key: 'jwt');
      
      if (user != null && jwt != null) {
        context.read<Session>().updateSession(user: user, jwt: jwt);
        Navigator.pushReplacementNamed(context, '/stats');
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Error al iniciar sesión")));
      }
    }

    return Scaffold(
      appBar: AppBar(title: Text("Login")),
      body: Center(
        child: ElevatedButton(
          onPressed: handleLogin,
          child: Text("Iniciar sesión"),
        ),
      ),
    );
  }
}
