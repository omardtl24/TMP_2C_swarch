import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class StatsService {
  final String baseUrl;
  final http.Client client;

  StatsService({String? baseUrl, http.Client? client})
      : client = client ?? http.Client(),
       baseUrl = dotenv.env['API_GATEWAY']!;

  Future<Map<String, dynamic>> getStats() async {
    final response = await http.get(Uri.parse('$baseUrl/stats'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al obtener stats');
    }
  }
}
