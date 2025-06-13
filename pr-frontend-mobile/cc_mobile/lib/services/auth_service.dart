import "dart:convert";
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;


class AuthService {
  Future<Map<String, dynamic>> authenticateInBackend(String idToken) async {
    final response = await http.post(
      Uri.parse('${dotenv.env['API_GATEWAY']}/auth/google'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'idToken': idToken}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error en autenticación: ${response.body}');
    }
  }
}
