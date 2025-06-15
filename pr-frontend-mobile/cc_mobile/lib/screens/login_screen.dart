import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../repository/google_auth_repository.dart';
import '../utils/session.dart';
import '../services/auth_service.dart';
import '../utils/secure_storage.dart';
import 'dart:ui';
import '../themes/app_theme.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;
  String? _errorMessage;

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        action: SnackBarAction(
          label: 'OK',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  Future<void> handleLogin() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authRepository = GoogleAuthRepository(authService: AuthService());
      final response = await authRepository.signInWithGoogle();
      
      if (response.isSuccess && response.data != null) {
        final jwt = await SecureStorage.instance.read(key: 'jwt');
        if (jwt != null) {
          context.read<Session>().updateSession(user: response.data!, jwt: jwt);
          Navigator.pushReplacementNamed(context, '/stats');
        } else {
          setState(() {
            _errorMessage = 'Error al obtener token de autenticación';
          });
          _showErrorSnackBar(_errorMessage!);
        }
      } else if (response.message == 'Se requiere registro') {
        final hasRegisterTokenResponse = await authRepository.hasRegisterToken();
        if (hasRegisterTokenResponse.isSuccess && hasRegisterTokenResponse.data == true) {
          // ignore: use_build_context_synchronously
          Navigator.pushReplacementNamed(context, '/register');
        } else {
          setState(() {
            _errorMessage = hasRegisterTokenResponse.message ?? 'Error al verificar registro';
          });
          _showErrorSnackBar(_errorMessage!);
        }
      } else {
        setState(() {
          _errorMessage = response.message ?? 'Error inesperado';
        });
        _showErrorSnackBar(_errorMessage!);
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error inesperado: ${e.toString()}';
      });
      _showErrorSnackBar(_errorMessage!);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
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
                              mainAxisAlignment: MainAxisAlignment.center,
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
                                SizedBox(height: 10),
                                Text(
                                  "Entra a tu cuenta y mira tus gastos personales y los de tus eventos sin complicaciones.",
                                  style: TextStyle(
                                    color: Colors.black54,
                                    fontSize: 16,
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
                            onPressed: _isLoading ? null : handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.black87,
                              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              side: BorderSide(color: primaryShades[40]!.withOpacity(0.7), width: 1.5),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                              elevation: 2,
                            ),
                            child: _isLoading 
                              ? SizedBox(
                                  width: 24, 
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: primaryShades[40],
                                  ))
                              : Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Image.asset(
                                    'assets/images/google_logo.png',
                                    height: 24,
                                    width: 24,
                                  ),
                                  SizedBox(width: 12),
                                  Text(
                                    "Iniciar sesión", 
                                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)
                                  ),
                                ],
                              ),
                          ),
                        ),
                        SizedBox(height: 8),
                        RichText(
                          text: TextSpan(
                            text: '¿No tienes cuenta? Registrate ahora',
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
