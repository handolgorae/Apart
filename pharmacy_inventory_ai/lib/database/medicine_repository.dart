import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/medicine.dart';

class MedicineRepository {
  static Database? _db;

  Future<Database> get database async {
    _db ??= await _open();
    return _db!;
  }

  Future<Database> _open() async {
    final dir = await getDatabasesPath();
    return openDatabase(
      join(dir, 'pharmacy.db'),
      version: 1,
      onCreate: (db, _) => db.execute('''
        CREATE TABLE medicines (
          id       TEXT PRIMARY KEY,
          name     TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          shelf    TEXT NOT NULL DEFAULT '',
          createdAt INTEGER NOT NULL
        )
      '''),
    );
  }

  Future<List<Medicine>> getAll() async {
    final db = await database;
    final rows = await db.query('medicines', orderBy: 'createdAt DESC');
    return rows.map(Medicine.fromMap).toList();
  }

  Future<void> insert(Medicine m) async {
    final db = await database;
    await db.insert('medicines', m.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> insertAll(List<Medicine> list) async {
    final db = await database;
    final batch = db.batch();
    for (final m in list) {
      batch.insert('medicines', m.toMap(),
          conflictAlgorithm: ConflictAlgorithm.ignore);
    }
    await batch.commit(noResult: true);
  }

  Future<void> update(Medicine m) async {
    final db = await database;
    await db.update('medicines', m.toMap(),
        where: 'id = ?', whereArgs: [m.id]);
  }

  Future<void> delete(String id) async {
    final db = await database;
    await db.delete('medicines', where: 'id = ?', whereArgs: [id]);
  }
}
