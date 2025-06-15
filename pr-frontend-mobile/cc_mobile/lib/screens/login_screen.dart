import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../repository/google_auth_repository.dart';
import '../utils/session.dart';
import '../services/auth_service.dart';
import '../utils/secure_storage.dart';
import 'dart:ui';
import '../themes/app_theme.dart';

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    void handleLogin() async {
      final authRepository = GoogleAuthRepository(authService: AuthService());
      final user = await authRepository.signInWithGoogle();
      final jwt = await SecureStorage.instance.read(key: 'jwt');
      if (user != null && jwt != null) {
        print('USERRRRR EN LOGIN: ${user.name}');
        context.read<Session>().updateSession(user: user, jwt: jwt);
        Navigator.pushReplacementNamed(context, '/stats');
      } else {
        final hasRegisterToken = await authRepository.hasRegisterToken();
        if (hasRegisterToken) {
          // ignore: use_build_context_synchronously

          Navigator.pushReplacementNamed(context, '/register');
        } else {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text("Error"),
              content: Text("Ocurrió un error inesperado."),
            ),
          );
        }
      }
    }

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: DecoratedBox(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/images/background_image_login.png'),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(10),
              ),

              child: Container(
                height: 200,
                width: double.infinity,
                margin: EdgeInsets.only(
                  top: 70,
                  left: 20,
                  right: 20,
                  bottom: 70,
                ),
                child: Stack(
                  children: [
                    // Fondo difuminado
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          alignment: Alignment.center,
                          padding: EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.5),
                            ),
                          ),
                          child: Container(
                            alignment: Alignment.centerLeft,
                            child: Column(
                              
                              children: [
                                RichText(
                                  text: TextSpan(
                                    style: TextStyle(
                                      fontSize: 30,
                                      fontWeight: FontWeight.w400,
                                      color: Colors.black87,
                                    ),
                                    children: [
                                      TextSpan(
                                        text: "Que bueno verte de nuevo, ",
                                      ),
                                      TextSpan(
                                        text: "Bienvenido",
                                        style: TextStyle(
                                          color: primaryShades[30],
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  "Entra a tu cuenta y mira tus gastos personales y los de tus eventos sin complicaciones.",
                                  style: TextStyle(
                                    color: Colors.black54,
                                    fontSize: 18,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                
                children: [
                  Expanded(
                    child: Column(
                      mainAxisAlignment:  MainAxisAlignment.end,
                      children: [
                        Center(
                          child: ElevatedButton(
                            onPressed: handleLogin,
                            child: Text("Iniciar sesión"),
                          ),
                        ),
                        RichText(
                          text: TextSpan(
                            text: '¿No tienes cuenta? ',
                            style: TextStyle(color: Colors.black54, fontSize: 16),
              
                            recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                Navigator.pushNamed(context, '/register');
                              },
                          ),
                        ),
                      ],
                    ),
                  ),
              
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children:[ SizedBox(
                        height: 70,
                        width: 70,
                        
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage('assets/images/CuentasClaras.png'),
                            ),
                          ),
                        ),
                      ),
                      ]
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
