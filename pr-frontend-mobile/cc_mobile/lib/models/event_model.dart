class EventModel {
  final int id;
  final String name;
  final String description;
  final String creatorName;

  EventModel({
    required this.id,
    required this.name,
    required this.description,
    required this.creatorName,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      creatorName: json['creator_name'] as String,
    );
  }

}