import 'package:flutter/material.dart';
import 'package:cc_mobile/mock/mock_google_auth_repository.dart';


class LoginScreen extends StatelessWidget {
  

  @override
  Widget build(BuildContext context) {

    
    void handleLogin() {
      final authRepository = MockGoogleAuthRepository();
      final user = authRepository.signInWithGoogle();
      print(user);
      // Navigator.pushReplacementNamed(context, '/stats');
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
