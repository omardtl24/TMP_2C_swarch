import 'package:flutter/material.dart';
import 'package:cc_mobile/repository/google_auth_repository.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:cc_mobile/utils/secure_storage.dart';


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
      appBar: AppBar(title: const Text('Registro')),
      body: _email == null
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    Text('Email detectado: $_email'),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _usernameController,
                      decoration: const InputDecoration(labelText: 'Nombre de usuario'),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Por favor ingresa un nombre de usuario';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    if (_error != null)
                      Text(_error!, style: const TextStyle(color: Colors.red)),
                    ElevatedButton(
                      onPressed: _isSubmitting ? null : _submit,
                      child: _isSubmitting
                          ? const CircularProgressIndicator()
                          : const Text('Registrar'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
