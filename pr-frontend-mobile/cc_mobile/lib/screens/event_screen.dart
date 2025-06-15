import 'package:cc_mobile/repository/google_auth_repository.dart';
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
  bool _isClosingSession = false;
  String? _errorMessage;
  List<EventModel> _events = [];
  final eventRepository = EventRepository();
  final googleAuthRepository = GoogleAuthRepository();

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

  Future<void> _logOut() async {
    try {
      setState(() {
        _isClosingSession = true;
        _errorMessage = null;
      });
      final session = context.read<Session>();
      await session.logout();
      await googleAuthRepository.logOut();
      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      setState(() {
        _errorMessage = 'Error al cerrar sesión: ${e.toString()}';
      });

      _showErrorSnackBar('Error al cerrar sesión: $_errorMessage');
    } finally {
      setState(() {
        _isClosingSession = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final session = context.watch<Session>();
    final userName = session.user?.name ?? 'Usuario';

    return Scaffold(
      appBar: AppBar(title: Text('Mis Eventos')),
      body: RefreshIndicator(
        onRefresh: _loadEvents,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bienvenido, $userName',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
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
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Center(
                                  child: Text('No tienes eventos disponibles'),
                                ),
                                SizedBox(height: 16),
                                ElevatedButton(
                                  onPressed: _loadEvents,

                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryShades[80],
                                    padding: EdgeInsets.all(8),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                  ),
                                  child: Text('Recargar eventos'),
                                ),
                              ],
                            )
                          : ListView.builder(
                              itemCount: _events.length,
                              itemBuilder: (context, index) {
                                final event = _events[index];
                                return EventCard(event: event);
                              },
                            ),
                    ),
              SizedBox(height: 16),
              Center(
                child: ElevatedButton(
                  onPressed: _isClosingSession ? null : _logOut,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryShades[50],
                    padding: EdgeInsets.all(16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: _isClosingSession
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Cerrar sesión',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
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

  const EventCard({Key? key, required this.event}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: primaryShades[90],
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.2),
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
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: primarySwatch[500],
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  Icons.calendar_today,
                  color: Colors.white,
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
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    event.creatorName,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  SizedBox(height: 4),
                  Text(
                    event.description,
                    style: TextStyle(fontSize: 14, color: Colors.grey[700]),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
