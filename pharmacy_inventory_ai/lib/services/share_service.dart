import 'package:share_plus/share_plus.dart';

class ShareService {
  static Future<void> shareInventory(String text) async {
    await Share.share(text, subject: '약국 재고 목록');
  }
}
