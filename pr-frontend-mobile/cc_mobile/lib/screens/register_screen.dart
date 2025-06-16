import 'package:flutter/material.dart';
import 'package:cc_mobile/repository/google_auth_repository.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:cc_mobile/utils/secure_storage.dart';
import 'package:flutter/gestures.dart';
import 'dart:ui';
import '../themes/app_theme.dart';


class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final GoogleAuthRepository authRepository = GoogleAuthRepository();
  String? _email;
  bool _isSubmitting = false;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadEmail();
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: Duration(seconds: 5),
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

  Future<void> _loadEmail() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final token = await SecureStorage.instance.read(key: 'register_token');
      if (token != null && JwtDecoder.isExpired(token) == false) {
        final decoded = JwtDecoder.decode(token);
        setState(() {
          _email = decoded['email'];
        });
      } else {
        setState(() {
          _email = null;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error al cargar los datos: ${e.toString()}';
      });
      _showErrorSnackBar(_error!);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    try {
      final response = await authRepository.registerUser(
        email: _email!,
        username: _usernameController.text.trim(),
      );

      if (response.isSuccess) {
        // ignore: use_build_context_synchronously
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        setState(() {
          _error = response.message ?? 'Error al registrar el usuario';
        });
        _showErrorSnackBar(_error!);
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
      _showErrorSnackBar(_error!);
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await authRepository.signInWithGoogle();

      if (response.isError && response.message == 'Se requiere registro') {
        await _loadEmail();
      } else if (response.isSuccess) {
        // Should not happen in register flow, but handle it gracefully
        final jwt = await SecureStorage.instance.read(key: 'jwt');
        if (jwt != null && response.data != null) {
          // ignore: use_build_context_synchronously
          Navigator.pushReplacementNamed(context, '/event');
        }
      } else {
        setState(() {
          _error = response.message ?? 'Error al iniciar sesión con Google';
        });
        _showErrorSnackBar(_error!);
      }
    } catch (e) {
      setState(() {
        _error = 'Error inesperado: ${e.toString()}';
      });
      _showErrorSnackBar(_error!);
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(body: Center(child: CircularProgressIndicator()));
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
                                        text:
                                            "Regístrate y empieza a tener tus ",
                                      ),
                                      TextSpan(
                                        text: "Cuentas Claras",
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
                                  "No te compliques más, accede y controla tus cuentas personales y la de los eventos que realizas con tus amigos",
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
              child: _email == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,

                      children: [
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan( 
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: primaryShades[50],
                              
                            ),
                            
                            
                            children: [
                              TextSpan(
                                text: "Comienza a tener tus Cuentas ",
                              ),
                              TextSpan(
                                text: "Claras",
                                style: TextStyle(
                                  color: Colors.yellow[800],
                                  
                                ),
                                
                              ),
                            ],
                          ),
                        ),

                        Expanded(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Center(
                                child: ElevatedButton(
                                  onPressed: _isLoading
                                      ? null
                                      : _handleGoogleSignIn,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: Colors.black87,
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 24,
                                      vertical: 12,
                                    ),
                                    side: BorderSide(
                                      color: primaryShades[40]!.withOpacity(
                                        0.7,
                                      ),
                                      width: 1.5,
                                    ),
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
                                          ),
                                        )
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
                                              "Registrate con Google",
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                              ),
                              SizedBox(height: 16),
                              RichText(
                                text: TextSpan(
                                  text: '¿Ya tienes cuenta? Inicia sesión',
                                  style: TextStyle(
                                    color: primaryShades[70],
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () {
                                      Navigator.pushReplacementNamed(
                                        context,
                                        '/login',
                                      );
                                    },
                                ),
                              ),
                            ],
                          ),
                        ),

                        Expanded(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              SizedBox(
                                height: 70,
                                width: 70,

                                child: DecoratedBox(
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: AssetImage(
                                        'assets/images/CuentasClaras.png',
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          child: Form(
                            key: _formKey,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Text(
                                  'Completa tu registro',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: primaryShades[30],
                                  ),
                                ),
                                SizedBox(height: 14),
                                Text(
                                  'Email detectado: $_email',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.black87,
                                  ),
                                  textAlign: TextAlign.start,
                                ),
                                SizedBox(height: 16),
                                TextFormField(
                                  controller: _usernameController,
                                  decoration: InputDecoration(
                                    labelText: 'Nombre de usuario',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    filled: true,
                                    fillColor: Colors.grey[100],
                                  ),
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'Por favor ingresa un nombre de usuario';
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(height: 25),
                                ElevatedButton(
                                  onPressed: _isSubmitting ? null : _submit,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryShades[30],
                                    foregroundColor: Colors.white,
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 32,
                                      vertical: 12,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                  ),
                                  child: _isSubmitting
                                      ? SizedBox(
                                          width: 24,
                                          height: 24,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : Text(
                                          'Confirmar registro',
                                          style: TextStyle(fontSize: 16),
                                        ),
                                ),
                                TextButton(
                                  onPressed: () async {
                                    await SecureStorage.instance.delete(
                                      key: 'register_token',
                                    );
                                    Navigator.pushReplacementNamed(
                                      context,
                                      '/login',
                                    );
                                  },
                                  child: Text(
                                    'Cancelar y salir',
                                    style: TextStyle(color: Colors.grey[700]),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 70,
                          width: 70,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image: AssetImage(
                                  'assets/images/CuentasClaras.png',
                                ),
                              ),
                            ),
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
