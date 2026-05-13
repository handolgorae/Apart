import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/medicine.dart';
import '../providers/medicine_provider.dart';

const _shelves = [
  '',
  'A-1', 'A-2', 'A-3',
  'B-1', 'B-2', 'B-3',
  'C-1', 'C-2', 'C-3',
  'D-1', 'D-2', 'D-3',
];

class MedicineCard extends StatelessWidget {
  final Medicine medicine;
  const MedicineCard({super.key, required this.medicine});

  @override
  Widget build(BuildContext context) {
    final provider = context.read<MedicineProvider>();

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 약품명 + 약장위치 + 삭제
            Row(
              children: [
                Expanded(
                  child: Text(
                    medicine.name,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
                _ShelfDropdown(medicine: medicine, provider: provider),
                IconButton(
                  icon: const Icon(Icons.delete_outline,
                      size: 20, color: Colors.redAccent),
                  onPressed: () => _confirmDelete(context, provider),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 6),
            // 수량 조절
            Row(
              children: [
                const Text('수량',
                    style: TextStyle(fontSize: 13, color: Colors.grey)),
                const SizedBox(width: 12),
                _QuantityButton(
                  icon: Icons.remove,
                  onPressed: medicine.quantity > 0
                      ? () => provider.updateQuantity(
                          medicine.id, medicine.quantity - 1)
                      : null,
                ),
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () => _editQuantityDialog(context, provider),
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1565C0).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${medicine.quantity}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1565C0),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 4),
                _QuantityButton(
                  icon: Icons.add,
                  onPressed: () =>
                      provider.updateQuantity(medicine.id, medicine.quantity + 1),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _editQuantityDialog(BuildContext context, MedicineProvider provider) {
    final ctrl = TextEditingController(text: '${medicine.quantity}');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(medicine.name),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(labelText: '수량', suffix: Text('개')),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('취소')),
          TextButton(
            onPressed: () {
              final qty = int.tryParse(ctrl.text) ?? medicine.quantity;
              provider.updateQuantity(medicine.id, qty);
              Navigator.pop(context);
            },
            child: const Text('확인'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, MedicineProvider provider) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('삭제 확인'),
        content: Text('${medicine.name}을(를) 목록에서 삭제할까요?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('취소')),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            onPressed: () {
              provider.delete(medicine.id);
              Navigator.pop(context);
            },
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }
}

class _ShelfDropdown extends StatelessWidget {
  final Medicine medicine;
  final MedicineProvider provider;
  const _ShelfDropdown({required this.medicine, required this.provider});

  @override
  Widget build(BuildContext context) {
    final current = _shelves.contains(medicine.shelf) ? medicine.shelf : '';
    return DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: current,
        isDense: true,
        items: _shelves
            .map((s) => DropdownMenuItem(
                  value: s,
                  child: Text(s.isEmpty ? '위치미정' : s,
                      style: const TextStyle(fontSize: 13)),
                ))
            .toList(),
        onChanged: (v) => provider.updateShelf(medicine.id, v ?? ''),
      ),
    );
  }
}

class _QuantityButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  const _QuantityButton({required this.icon, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(icon, size: 22),
      onPressed: onPressed,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
      color: onPressed != null ? const Color(0xFF1565C0) : Colors.grey,
    );
  }
}
