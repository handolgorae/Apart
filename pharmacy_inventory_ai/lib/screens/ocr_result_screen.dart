import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/medicine_provider.dart';
import '../services/gemini_service.dart';

class OcrResultScreen extends StatefulWidget {
  final File imageFile;
  final List<GeminiMedicineResult> geminiResults;

  const OcrResultScreen({
    super.key,
    required this.imageFile,
    required this.geminiResults,
  });

  @override
  State<OcrResultScreen> createState() => _OcrResultScreenState();
}

class _OcrResultScreenState extends State<OcrResultScreen> {
  // {name: String, quantity: int, selected: bool}
  late List<Map<String, dynamic>> _items;
  final _nameCtrl = TextEditingController();
  final _qtyCtrl = TextEditingController(text: '0');

  @override
  void initState() {
    super.initState();
    _items = widget.geminiResults
        .map((r) => {'name': r.name, 'quantity': r.quantity, 'selected': true})
        .toList();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _qtyCtrl.dispose();
    super.dispose();
  }

  void _addCustom() {
    final name = _nameCtrl.text.trim();
    if (name.isEmpty) return;
    final qty = int.tryParse(_qtyCtrl.text) ?? 0;
    setState(() {
      _items.add({'name': name, 'quantity': qty, 'selected': true});
      _nameCtrl.clear();
      _qtyCtrl.text = '0';
    });
  }

  Future<void> _save() async {
    final selected =
        _items.where((e) => e['selected'] == true).toList();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('추가할 약품을 하나 이상 선택하세요.')),
      );
      return;
    }
    final provider = context.read<MedicineProvider>();
    await provider.addFromGemini(
      selected.map((e) => {'name': e['name'] as String, 'quantity': e['quantity'] as int}).toList(),
    );
    if (!mounted) return;
    Navigator.popUntil(context, (r) => r.isFirst);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${selected.length}개 약품이 추가되었습니다.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedCount = _items.where((e) => e['selected'] == true).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI 분석 결과'),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text('저장',
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 160,
            width: double.infinity,
            child: Image.file(widget.imageFile, fit: BoxFit.cover),
          ),

          // 직접 추가
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: TextField(
                    controller: _nameCtrl,
                    decoration: const InputDecoration(
                      hintText: '약품명 직접 입력',
                      border: OutlineInputBorder(),
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                SizedBox(
                  width: 64,
                  child: TextField(
                    controller: _qtyCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: '수량',
                      border: OutlineInputBorder(),
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                FilledButton(onPressed: _addCustom, child: const Text('추가')),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
            child: Row(
              children: [
                Text(
                  widget.geminiResults.isEmpty
                      ? 'AI 인식 결과 없음 — 직접 입력하세요'
                      : 'AI 인식 결과 — $selectedCount개 선택됨',
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          Expanded(
            child: _items.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.camera_alt_outlined,
                            size: 48, color: Colors.grey[400]),
                        const SizedBox(height: 8),
                        Text(
                          'AI가 약품을 인식하지 못했습니다.\n위에서 직접 입력해 주세요.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _items.length,
                    itemBuilder: (_, i) {
                      final item = _items[i];
                      return CheckboxListTile(
                        title: Text(item['name'] as String),
                        subtitle: item['quantity'] > 0
                            ? Text('AI 추정 수량: ${item['quantity']}개',
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF1565C0)))
                            : null,
                        value: item['selected'] as bool,
                        onChanged: (v) => setState(
                            () => _items[i]['selected'] = v ?? false),
                        controlAffinity: ListTileControlAffinity.leading,
                        dense: true,
                      );
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: FilledButton(
            onPressed: _save,
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(48),
              backgroundColor: const Color(0xFF1565C0),
            ),
            child: Text('$selectedCount개 약품 목록에 추가'),
          ),
        ),
      ),
    );
  }
}
