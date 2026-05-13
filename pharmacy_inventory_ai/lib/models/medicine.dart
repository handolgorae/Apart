class Medicine {
  final String id;
  String name;
  int quantity;
  String shelf;
  final DateTime createdAt;

  Medicine({
    required this.id,
    required this.name,
    this.quantity = 0,
    this.shelf = '',
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'name': name,
        'quantity': quantity,
        'shelf': shelf,
        'createdAt': createdAt.millisecondsSinceEpoch,
      };

  factory Medicine.fromMap(Map<String, dynamic> map) => Medicine(
        id: map['id'] as String,
        name: map['name'] as String,
        quantity: map['quantity'] as int,
        shelf: map['shelf'] as String? ?? '',
        createdAt: DateTime.fromMillisecondsSinceEpoch(map['createdAt'] as int),
      );

  Medicine copyWith({String? name, int? quantity, String? shelf}) => Medicine(
        id: id,
        name: name ?? this.name,
        quantity: quantity ?? this.quantity,
        shelf: shelf ?? this.shelf,
        createdAt: createdAt,
      );
}
