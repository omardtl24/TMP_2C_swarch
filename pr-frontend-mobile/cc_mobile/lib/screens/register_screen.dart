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
  final GoogleAuthRepository authRepository= GoogleAuthRepository();
  String? _email;
  bool _isSubmitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadEmail();
  }

  Future<void> _loadEmail() async {
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
}

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    try {
      final success = await authRepository.registerUser(
        email: _email!,
        username: _usernameController.text.trim(),
      );

      if (success) {
        // Puedes navegar al Home u otra pantalla
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        setState(() {
          _error = 'Error al registrar el usuario.';
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isSubmitting = false;
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
                                        text: "Regístrate y empieza a tener tus ",
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
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Center(
                              child: ElevatedButton(
                                onPressed: () async {
                                  final success = await authRepository.signInWithGoogle();
                                  if (success != null) {
                                    // If successful, the _loadEmail will handle the navigation
                                    await _loadEmail();
                                  }
                                },
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
                                child: Row(
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
                                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            SizedBox(height: 8),
                            RichText(
                              text: TextSpan(
                                text: '¿Ya tienes cuenta? Inicia sesión',
                                style: TextStyle(color: Colors.black54, fontSize: 16),
                                recognizer: TapGestureRecognizer()
                                  ..onTap = () {
                                    Navigator.pushReplacementNamed(context, '/login');
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
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Form(
                          key: _formKey,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
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
                              SizedBox(height: 20),
                              Text(
                                'Email detectado: $_email',
                                style: TextStyle(fontSize: 16, color: Colors.black87),
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
                              SizedBox(height: 24),
                              if (_error != null)
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 16),
                                  child: Text(
                                    _error!,
                                    style: TextStyle(color: Colors.red),
                                  ),
                                ),
                              ElevatedButton(
                                onPressed: _isSubmitting ? null : _submit,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: primaryShades[30],
                                  foregroundColor: Colors.white,
                                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
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
                                  await SecureStorage.instance.delete(key: 'register_token');
                                  Navigator.pushReplacementNamed(context, '/login');
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
                              image: AssetImage('assets/images/CuentasClaras.png'),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                    ],
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
