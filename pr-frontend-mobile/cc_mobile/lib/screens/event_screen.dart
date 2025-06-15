import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../repository/event_repository.dart';
import '../models/event_model.dart';
import '../utils/session.dart';
import '../themes/app_theme.dart';

class EventScreen extends StatefulWidget {
  const EventScreen({Key? key}) : super(key: key);

  @override
  State<EventScreen> createState() => _EventScreenState();
}

class _EventScreenState extends State<EventScreen> {
  bool _isLoading = false;
  String? _errorMessage;
  List<EventModel> _events = [];

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

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

  Future<void> _loadEvents() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final eventRepository = EventRepository();
      final response = await eventRepository.getMyEvents();
      
      if (response.isSuccess && response.data != null) {
        setState(() {
          _events = response.data!;
        });
      } else {
        setState(() {
          _errorMessage = response.message ?? 'Error al cargar los eventos';
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
    final session = context.watch<Session>();
    final userName = session.user?.name ?? 'Usuario';
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Mis Eventos'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadEvents,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bienvenido, $userName',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              _isLoading && _events.isEmpty
                ? Center(
                    child: CircularProgressIndicator(
                      color: primaryShades[40],
                    ),
                  )
                : Expanded(
                    child: _events.isEmpty 
                      ? Center(
                          child: Text('No tienes eventos disponibles'),
                        )
                      : ListView.builder(
                          itemCount: _events.length,
                          itemBuilder: (context, index) {
                            final event = _events[index];
                            return EventCard(event: event);
                          },
                        ),
                  ),
            ],
          ),
        ),
      ),
      
    );
  }
}

class EventCard extends StatelessWidget {
  final EventModel event;
  
  const EventCard({
    Key? key,
    required this.event,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // Left icon container
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: primaryShades[50]!.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  Icons.calendar_today,
                  color: primaryShades[50],
                  size: 28,
                ),
              ),
            ),
            SizedBox(width: 16),
            // Middle content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  Text(
                    event.creatorName ?? "Creador",
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  if (event.description != null)
                    Text(
                      event.description!,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[700],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                ],
              ),
            ),
            // Right price
            
          ],
        ),
      ),
    );
  }
}
