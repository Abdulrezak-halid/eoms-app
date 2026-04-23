## QDMS Doküman Bağlama

**QDMS (Quality Document Management System)** entegrasyonu, uzak bir QDMS sunucusunda bulunan dokümanların uygulamadaki belirli sayfalara bağlanmasını sağlar. Bağlanan doküman, ilgili sayfada doğrudan görüntülenir.

Her sayfa için birden fazla QDMS kaydı tanımlanabilir; ancak **aynı anda yalnızca bir kayıt aktif olabilir**. Bu sayede, her sayfada tek ve net bir doküman gösterimi sağlanır.

### Kullanım Notları

* Bir QDMS kaydı aktif hale getirilmeden önce, doküman **Fetch** butonu kullanılarak uzak sunucudan **alınmış olmalıdır**.
* Bir sayfa için zaten aktif bir QDMS kaydı varsa, aynı sayfa için başka bir kayıt aynı anda aktif edilemez.
* Bir sayfada gösterilen dokümanı değiştirmek için önce yeni bir kayıt ekleyin, ardından dokümanı fetch edip aktif hale getirin.
