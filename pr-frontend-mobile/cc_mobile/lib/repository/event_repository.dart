import 'package:cc_mobile/services/events_service.dart';
import 'package:cc_mobile/models/event_model.dart';
import 'package:cc_mobile/models/response.dart';
import 'package:cc_mobile/utils/secure_storage.dart';


abstract class EventRepositoryInterface {
  // Define methods that the repository should implement
  Future<Response<List<EventModel>>> getMyEvents();
}


class EventRepository implements EventRepositoryInterface {
  final EventsService _eventsService;
  EventRepository({EventsService? eventsService})
      : _eventsService = eventsService ?? EventsService();


  @override
  Future<Response<List<EventModel>>> getMyEvents() async {
    try {
      final jwt = await SecureStorage.instance.read(key: 'jwt');
      if (jwt == null) {
        return Response.error('No se encontró el token JWT');
      }
      final response = await _eventsService.getMyEvents(jwt:jwt);
      if(response['status'] == 'success') {
        final List<EventModel> events = (response['data'] as List)
            .map((event) => EventModel.fromJson(event))
            .toList();
        
        return Response.success(events);
      } else {
        String errorMsg = 'Error al traer eventos';
        if (response.containsKey('message')) {
          errorMsg = response['message'];
        
        }
        return Response.error('Error al obtener eventos: $errorMsg');
      }
    } catch (e) {
      return Response.error('Error de conexión: ${e.toString()}');
    }
  }

}