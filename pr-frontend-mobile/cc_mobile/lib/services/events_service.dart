import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EventsService {
  final String baseUrl;
  final http.Client client;

  EventsService({String? baseUrl, http.Client? client})
      : client = client ?? http.Client(),
       baseUrl = dotenv.env['API_GATEWAY_URL']!;

  Future<Map<String, dynamic>> getMyEvents({required String jwt}) async {
    final response = await http.get(Uri.parse('$baseUrl/api/events/me'),
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer $jwt', // Asegúrate de tener un token válido
        // Aquí podrías agregar más headers si es necesario, como autenticación
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al obtener eventos');
    }
  }
}
