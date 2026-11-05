'use strict';
// Dữ liệu hư cấu cho bản mẫu: một chủ, ba cơ sở kinh doanh.
const notes = {
  cafeFeedback:{business:'coffee',kind:'Đánh giá của khách',title:'Khách nói gì về Góc Nhỏ?',meta:'Cà phê Góc Nhỏ · Tháng 9 · 52 đánh giá',body:['<mark>16 trong 52 đánh giá nhắc đến việc chờ lâu, chủ yếu từ 7h30 đến 9h.</mark>','12 đánh giá khen cà phê sữa yến mạch.','Một khách quen viết: “Cà phê ngon, giá mà buổi sáng gọi món nhanh hơn chút.”']},
  cafePlan:{business:'coffee',kind:'Ghi chép của chủ quán',title:'Thử giảm thời gian chờ buổi sáng',meta:'Cà phê Góc Nhỏ · Ngày 28/9',body:['<mark>Thử bố trí riêng một người nhận món từ 7h30 đến 9h trong một tuần.</mark>','Tách chỗ nhận đồ uống để khách lấy món không chắn hàng chờ.','Giữ nguyên thực đơn trong đợt thử để dễ so sánh thời gian chờ.']},
  cafeSales:{business:'coffee',kind:'Sổ thu chi',title:'Thu chi tháng 9 của Góc Nhỏ',meta:'Cà phê Góc Nhỏ · Tổng kết tháng',body:['<mark>Doanh thu: 112 triệu. Nguyên liệu: 36 triệu. Thuê mặt bằng: 18 triệu. Lương: 32 triệu. Chi phí khác đã ghi nhận: 8 triệu.</mark>','Còn lại 18 triệu sau các khoản đã ghi trong sổ.','Chưa tính thuế, tiền công của chủ quán và các khoản chưa nhập vào sổ.']},
  coldBrew:{business:'coffee',kind:'Bảng tính giá vốn',title:'Thử bán cà phê ủ lạnh đóng chai',meta:'Cà phê Góc Nhỏ · Chai 250 ml',body:['<mark>Nguyên liệu và chai lọ hết 21.400đ/chai. Giá bán dự kiến: 55.000đ/chai.</mark>','Giá vốn trên chưa gồm công làm, tiền thuê và các chi phí chung.','Thử làm 30 chai vào cuối tuần rồi ghi lại số chai bán được.']},
  bookings:{business:'rental',kind:'Lịch đặt nhà',title:'Lịch khách ở trong tháng 9',meta:'Nhà Bên Vườn · Một căn nhà hai phòng ngủ',body:['<mark>Có khách đặt 9/20 đêm trong tuần còn mở bán. Cả 8 đêm cuối tuần đều có khách.</mark>','Đã khóa hai đêm trong tuần để sửa nhà, còn 28 đêm mở bán trong tháng.','Tổng cộng có khách ở 17/28 đêm mở bán.']},
  enquiries:{business:'rental',kind:'Tin nhắn hỏi thuê',title:'Khách hỏi gì trước khi đặt nhà?',meta:'Nhà Bên Vườn · Tháng 9 · 7 lượt hỏi ngày thường',body:['<mark>7 khách hỏi ở ngày thường, nhưng chỉ 2 khách đặt.</mark>','3 khách hỏi Wi-Fi có đủ ổn định để làm việc không.','2 khách hỏi giá ở ba đêm. Hiện chưa có giá riêng cho kỳ ở dài hơn.']},
  rates:{business:'rental',kind:'Bảng giá',title:'Giá thuê Nhà Bên Vườn',meta:'Nhà Bên Vườn · Giá đang áp dụng trong bản mẫu',body:['Ngày thường: 1,4 triệu/đêm. Cuối tuần: 2,1 triệu/đêm.','<mark>Chưa có giá riêng cho khách ở từ ba đêm trở lên.</mark>','Dọn nhà hết 250.000đ/lượt, đã tính trong giá thuê. Phí nền tảng đặt phòng tùy kênh.']},
  guestReviews:{business:'rental',kind:'Đánh giá của khách ở',title:'Khách nhận xét về Nhà Bên Vườn',meta:'Nhà Bên Vườn · 18 đánh giá gần đây',body:['Điểm trung bình: 4,7/5. Khách thường khen khu vườn yên tĩnh.','<mark>5 trong 18 đánh giá nhắc đến Wi-Fi chập chờn ở phòng ngủ trên lầu.</mark>','Một khách viết: “Nhà yên tĩnh, vườn đẹp, nhưng Wi-Fi trên lầu hay rớt khi mình làm việc.”']},
  repairs:{business:'rental',kind:'Ghi chép sửa nhà',title:'Việc đã sửa và báo giá còn chờ',meta:'Nhà Bên Vườn · Cập nhật ngày 30/9',body:['<mark>Đã khởi động lại bộ phát Wi-Fi hai lần. Báo giá nâng cấp hệ thống là 4,8 triệu, chủ nhà chưa duyệt.</mark>','Vòi bếp đã sửa xong ngày 10/9.','Chưa hẹn ngày lắp hệ thống Wi-Fi mới.']},
  flowerOrders:{business:'flowers',kind:'Sổ đơn hàng',title:'Đơn hoa đã chốt tuần này',meta:'Tiệm hoa Mây · 18 đơn đã chốt',body:['<mark>Đã chốt 10 bó hồng kem, 6 bó cúc và 2 bó hướng dương.</mark>','6 đơn hẹn giao từ 8h đến 9h sáng thứ Bảy.','2 trong 6 đơn sáng thứ Bảy chưa có địa chỉ nhận đầy đủ.']},
  flowerStock:{business:'flowers',kind:'Sổ hoa tại tiệm',title:'Hoa còn tại Mây',meta:'Tiệm hoa Mây · Kiểm kê chiều thứ Năm',body:['<mark>Còn 64 cành hồng kem, 40 cành cúc và 12 cành hướng dương dùng được.</mark>','Mỗi bó hồng kem dùng 8 cành; bó cúc dùng 5 cành; bó hướng dương dùng 3 cành.','Nhà vườn nhận bổ sung hoa đến 16h thứ Sáu.']},
  flowerDelivery:{business:'flowers',kind:'Ghi chép giao hàng',title:'Lịch và khả năng giao hoa',meta:'Tiệm hoa Mây · Lịch giao tuần này',body:['<mark>Một người giao được tối đa 3 đơn trong khung 8h–9h sáng thứ Bảy. Hiện mới có một người nhận giao.</mark>','Có thể hỏi thêm người giao hoặc thương lượng khung giờ khác với khách.','Cần chốt đủ địa chỉ và số điện thoại nhận trước chiều thứ Sáu.']},
  flowerPrices:{business:'flowers',kind:'Mẫu bó và bảng giá',title:'Các bó hoa đang nhận đặt',meta:'Tiệm hoa Mây · Giá bó đã gồm giấy gói',body:['<mark>Bó hồng kem 8 cành: 350.000đ. Bó cúc 5 cành: 250.000đ. Bó hướng dương 3 cành: 280.000đ.</mark>','Phí giao tính riêng sau khi có địa chỉ.','Trước khi nhận đơn cần xác nhận mẫu bó, lời nhắn trên thiệp, giờ và địa chỉ nhận.']}
};
const questions = {
  focus:{short:'Tuần này nên lo việc gì trước?',prompt:'Tuần này nên ưu tiên việc gì ở cả ba cơ sở?',keys:/uu tien|lam gi truoc|viec.*(?:truoc|tuan)|tuan nay|tap trung|can chu y/i,sources:['cafeFeedback','repairs','flowerOrders','flowerDelivery'],
    answer:[{p:'Mình sẽ chốt việc giao hoa trước, rồi xử lý giờ cao điểm của quán và Wi-Fi ở nhà cho thuê.'},{ul:['Tiệm hoa Mây có 6 đơn cùng hẹn 8h–9h sáng thứ Bảy, trong khi một người chỉ giao được 3 đơn. Hai đơn còn thiếu địa chỉ: cần chốt thông tin và thêm người giao hoặc đổi giờ với khách [3][4].','Ở Góc Nhỏ, 16/52 đánh giá nhắc chuyện chờ lâu buổi sáng. Nên thử tách chỗ gọi món và chỗ lấy đồ uống [1].','Nhà Bên Vườn còn báo giá Wi-Fi 4,8 triệu chưa duyệt và chưa có lịch lắp. Chốt phương án trước khi hứa với khách là mạng đã ổn [2].']}]},
  reply:{short:'Soạn giúp lời trả lời khách ở',prompt:'Soạn lời trả lời đánh giá về Wi-Fi ở Nhà Bên Vườn.',reply:true,keys:/tra loi|phan hoi danh gia|soan|viet.*(?:khach|danh gia)/i,sources:['guestReviews','repairs'],
    answer:[{p:'Bạn có thể trả lời thế này:'},{quote:'Cảm ơn bạn đã ở Nhà Bên Vườn và chia sẻ thật lòng. Mình xin lỗi vì Wi-Fi trên lầu làm gián đoạn công việc của bạn. Bên mình đã ghi nhận và đang xem phương án cải thiện đường truyền. Rất vui vì bạn thích khu vườn yên tĩnh, và cảm ơn bạn đã nhắc để mình chăm chút căn nhà tốt hơn.'},{p:'Mình chưa hứa ngày sửa xong vì báo giá vẫn chưa được duyệt và chưa có lịch lắp [2]. Đây cũng là vấn đề được nhắc lại trong các đánh giá gần đây [1].'}]},
  weekdays:{short:'Làm sao có thêm khách ngày thường?',prompt:'Làm sao để Nhà Bên Vườn có thêm khách thuê ngày thường?',keys:/ngay thuong|trong tuan|trong dem|dat nha|dat phong|thue|lap day|them khach/i,sources:['bookings','enquiries','rates'],
    answer:[{p:'Thử bắt đầu từ khách muốn ở ba đêm, chưa cần giảm giá tất cả các ngày.'},{ul:['Tháng trước, ngày thường có khách 9/20 đêm mở bán; cả 8 đêm cuối tuần đều kín [1].','Có 7 lượt hỏi ngày thường nhưng chỉ 2 khách chốt. Hai khách đã hỏi riêng giá ba đêm [2].','Bảng giá hiện chưa có mức riêng cho khách ở dài hơn [3].']},{p:'Bạn có thể thử một gói ba đêm ngày thường rồi xem số đặt mới có bù được chi phí dọn nhà và phí nền tảng không. Nhớ xử lý Wi-Fi trước: ba khách đã hỏi về việc làm việc tại nhà [2].'}]},
  repairs:{short:'Nhà có gì cần sửa trước?',prompt:'Nhà Bên Vườn nên sửa gì trước theo đánh giá của khách?',keys:/sua|hong|bao tri|wi-?fi|wifi|khach|danh gia|ben vuon|nha/i,sources:['guestReviews','repairs'],
    answer:[{p:'Wi-Fi trên lầu là việc đáng xử lý trước.'},{ul:['5/18 đánh giá nhắc đến kết nối chập chờn, dù điểm chung vẫn tốt ở mức 4,7/5 [1].','Bộ phát đã được khởi động lại hai lần. Báo giá nâng cấp là 4,8 triệu, nhưng chưa duyệt và chưa hẹn lắp [2].']},{p:'Nhờ thợ xác nhận vùng phủ sóng ở phòng ngủ trên lầu rồi kiểm tra thực tế sau khi làm. Vòi bếp đã có ghi nhận sửa xong, nên không cần đưa lại vào danh sách [2].'}]},
  pricing:{short:'Chai cà phê nên bán bao nhiêu?',prompt:'Cà phê ủ lạnh đóng chai ở Góc Nhỏ nên thử bán giá bao nhiêu?',keys:/u lanh|dong chai|chai ca phe|gia ban|dinh gia|gia.*chai/i,sources:['coldBrew'],
    answer:[{p:'Bảng tính đang đề xuất 55.000đ/chai 250 ml. Bạn có thể dùng mức đó cho đợt thử 30 chai cuối tuần [1].'},{p:'Mỗi chai còn 33.600đ sau 21.400đ nguyên liệu và chai lọ, tương đương khoảng 61% giá bán. Số này chưa trừ công làm, tiền thuê và chi phí chung, nên chưa phải tiền lãi thực nhận [1].'},{p:'Bán thử xong, xem bao nhiêu chai bán hết và mất bao nhiêu công làm rồi hãy chốt giá lâu dài.'}]},
  money:{short:'Tháng rồi quán còn lại bao nhiêu?',prompt:'Sau chi phí, Cà phê Góc Nhỏ còn lại bao nhiêu trong tháng 9?',keys:/\b(?:tien|lai|lo)\b|loi bao nhieu|chi phi|thu chi|doanh thu|thang (?:roi|truoc|9)|con lai/i,sources:['cafeSales'],
    answer:[{p:'Góc Nhỏ thu 112 triệu trong tháng 9. Trừ các khoản đã ghi vào sổ, còn lại 18 triệu [1].'},{table:[['Thu chi tháng 9','Số tiền'],['Doanh thu','112 triệu'],['Nguyên liệu','−36 triệu'],['Thuê mặt bằng','−18 triệu'],['Lương','−32 triệu'],['Chi phí khác đã ghi','−8 triệu'],['Còn lại trước thuế và công của chủ','18 triệu']]},{p:'Sổ chưa tính thuế, công của bạn và các khoản chưa nhập, nên 18 triệu này chưa phải khoản có thể rút hết về dùng [1].'}]},
  feedback:{short:'Khách đang góp ý gì cho quán?',prompt:'Khách góp ý gì cho Cà phê Góc Nhỏ, và nên cải thiện gì?',keys:/gop y|phan hoi|khach|danh gia|ca phe|goc nho|xep hang|cho lau|cai thien|quan/i,sources:['cafeFeedback','cafePlan'],
    answer:[{p:'Khách thích cà phê, nhưng buổi sáng đang phải chờ hơi lâu.'},{ul:['16/52 đánh giá nhắc chuyện chờ, chủ yếu từ 7h30 đến 9h [1].','Cà phê sữa yến mạch được khen 12 lần, nên cứ giữ điểm mạnh này [1].']},{p:'Trong ghi chép đã có một cách thử khá gọn: bố trí riêng người nhận món từ 7h30 đến 9h và tách chỗ lấy đồ uống. Thử một tuần rồi so thời gian chờ, chưa cần đổi thực đơn [2].'}]},
  flowerReply:{short:'Soạn tin nhắn nhận đơn hoa',prompt:'Soạn tin nhắn cho khách muốn đặt bó hồng kem ở Tiệm hoa Mây.',reply:true,keys:/tra loi|tin nhan|soan|viet|nhan don/i,sources:['flowerPrices','flowerDelivery'],
    answer:[{p:'Bạn có thể gửi khách lời nhắn này:'},{quote:'Mây có bó hồng kem 8 cành, giá 350.000đ đã gồm giấy gói ạ. Bạn cho tiệm xin giờ nhận, địa chỉ và lời nhắn trên thiệp nhé. Có địa chỉ rồi Mây báo phí giao cụ thể, rồi chốt đơn cùng bạn nha.'},{p:'Giá bó đã có trong bảng giá, còn phí giao tính riêng theo địa chỉ [1]. Chưa hứa giờ giao ngay vì khung 8h–9h sáng thứ Bảy đang cần bổ sung người [2].'}]},
  flowerDelivery:{short:'Lịch giao hoa có bị dồn không?',prompt:'Kiểm tra lịch giao hoa tuần này của Tiệm hoa Mây.',keys:/giao|don|tre|muon|hen|lich/i,sources:['flowerOrders','flowerDelivery'],
    answer:[{p:'Có một khung giờ đang dồn đơn: 8h–9h sáng thứ Bảy.'},{ul:['6 đơn cùng hẹn trong khung đó, hai đơn chưa có địa chỉ nhận đầy đủ [1].','Hiện chỉ có một người giao, tối đa 3 đơn trong một giờ [2].']},{p:'Chốt ngay địa chỉ còn thiếu trước chiều thứ Sáu. Sau đó thêm một người giao có khả năng nhận đủ 3 đơn còn lại, hoặc hỏi khách có thể nhận sang khung giờ khác không. Chưa nên hứa thêm đơn vào giờ này [2].'}]},
  flowerStock:{short:'Tiệm hoa cần nhập thêm gì?',prompt:'Tiệm hoa Mây cần nhập thêm hoa gì cho các đơn đã chốt?',keys:/ton|nhap|thieu|canh|con bao nhieu|du (?:hoa|hang)/i,sources:['flowerOrders','flowerStock'],
    answer:[{p:'Theo các đơn đã chốt, Mây đang thiếu ít nhất 16 cành hồng kem.'},{table:[['Loại hoa','Cần cho đơn đã chốt','Còn tại tiệm'],['Hồng kem','10 bó × 8 = 80 cành','64 cành → thiếu 16'],['Cúc','6 bó × 5 = 30 cành','40 cành → dư 10'],['Hướng dương','2 bó × 3 = 6 cành','12 cành → dư 6']]},{p:'Số bó lấy từ sổ đơn [1], số cành và định mức mỗi bó lấy từ sổ hoa [2]. Bạn nên bổ sung 16 cành hồng trước hạn 16h thứ Sáu; phần dự phòng cho hoa hỏng cần tính riêng theo chất lượng thực tế [2].'}]}
};
const pickNotes = business => Object.fromEntries(Object.entries(notes).filter(([,note]) => note.business === business));
const workspaces = {
  all:{name:'Tất cả',description:'Quán cà phê, nhà cho thuê và tiệm hoa của bạn.',placeholder:'Hỏi chuyện quán, nhà cho thuê hay tiệm hoa…',docs:notes,scenarios:[questions.focus,questions.reply,questions.weekdays,questions.repairs,questions.pricing,questions.money,questions.feedback,questions.flowerReply,questions.flowerStock,questions.flowerDelivery],suggestions:['focus','weekdays','flowerStock']},
  coffee:{name:'Cà phê Góc Nhỏ',description:'Khách quen, thu chi và những việc ở Cà phê Góc Nhỏ.',placeholder:'Hỏi về khách, thu chi hay một ý tưởng cho quán…',docs:pickNotes('coffee'),scenarios:[questions.pricing,questions.money,questions.feedback],suggestions:['feedback','money','pricing']},
  rental:{name:'Nhà Bên Vườn',description:'Lịch khách ở và những việc cần chăm chút tại Nhà Bên Vườn.',placeholder:'Hỏi về lịch đặt, lời khách nhắn hay việc sửa nhà…',docs:pickNotes('rental'),scenarios:[questions.reply,questions.weekdays,questions.repairs],suggestions:['weekdays','repairs','reply']},
  flowers:{name:'Tiệm hoa Mây',description:'Hoa tại tiệm, đơn đã chốt và lịch giao của Mây.',placeholder:'Hỏi về hoa cần nhập, đơn hàng hay lịch giao…',docs:pickNotes('flowers'),scenarios:[questions.flowerReply,questions.flowerStock,questions.flowerDelivery],suggestions:['flowerStock','flowerDelivery','flowerReply']}
};
let workspace = 'all', docs, scenarios;
const fallback = {p:'Mình chưa có đủ thông tin để trả lời câu này. Bạn thử một trong các câu bên dưới nhé:'};
const wordDelay = 20;
const icons = {
  search:'<svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>',
  read:'<svg viewBox="0 0 16 16"><path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3M6 8h4M6 11h4"/></svg>',
  check:'<svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7"/></svg>',
  chevron:'<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4"/></svg>',
  copy:'<svg viewBox="0 0 16 16"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 10V4a1 1 0 011-1h6"/></svg>',
  retry:'<svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 11-1.5-3.5M13 3v3h-3"/></svg>',
  up:'<svg viewBox="0 0 16 16"><path d="M5 7v6H3V7zM5 7l3-5c1 0 2 .7 1.6 2L9 6h3.5a1 1 0 011 1.2l-1 5a1 1 0 01-1 .8H5"/></svg>',
  down:'<svg viewBox="0 0 16 16"><path d="M5 9V3H3v6zM5 9l3 5c1 0 2-.7 1.6-2L9 10h3.5a1 1 0 001-1.2l-1-5a1 1 0 00-1-.8H5"/></svg>'
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const localize = text => window.showcaseLanguage?.translate(text) ?? text;
const streams = new Map();
let languageVersion = 0;
const $ = selector => document.querySelector(selector);
const chat = $('#main'), thread = $('#thread'), input = $('#composer-input'), sendButton = $('#send'), composer = $('#composer');
const emptyState = $('#empty');
let run = 0, busy = false, readCount = 0;
const wait = ms => new Promise(done => setTimeout(done, reduceMotion ? 0 : ms));
const announce = text => { $('#status').textContent = text; };
const scrollDown = () => { thread.scrollTop = thread.scrollHeight; };
function element(tag, className, text){ const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.innerHTML = window.portfolioIcons.text(text); return node; }
function suggestionButton(scenario, className){
  const button = element('button', className);
  button.type = 'button';
  button.append(element('span', 'suggestion-dot'), element('span', '', scenario.short));
  button.addEventListener('click', () => ask(localize(scenario.prompt)));
  return button;
}
function renderSuggestions(){
  $('#suggestions').replaceChildren();
  workspaces[workspace].suggestions.forEach(key => $('#suggestions').append(suggestionButton(questions[key], 'suggestion')));
}
function renderWorkspaces(){
  for (const [key, space] of Object.entries(workspaces)){
    const button = element('button', 'business-tab', space.name);
    button.type = 'button';
    button.dataset.workspace = key;
    button.addEventListener('click', () => setWorkspace(key));
    $('#businesses').append(button);
  }
}
function setWorkspace(key){
  if (key === workspace && docs) return;
  if (docs) newChat();
  workspace = key;
  ({docs, scenarios} = workspaces[key]);
  const space = workspaces[key];
  document.querySelectorAll('[data-workspace]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.workspace === key)));
  $('#business-context').textContent = space.description;
  setSourceView('library');
  input.placeholder = space.placeholder;
  renderSuggestions();
  resetSources();
  renderLibrary();
  announce(`Đã chuyển sang ${space.name}.`);
}
function renderLibrary(){
  const list = $('#library-list');
  list.replaceChildren();
  $('#library-count').textContent = String(Object.keys(docs).length).padStart(2, '0');
  for (const [key, doc] of Object.entries(docs)){
    const item = element('li'), button = element('button', 'library-doc');
    button.type = 'button';
    const icon = element('span', 'library-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = icons.read;
    const copy = element('span', 'library-copy');
    copy.append(element('strong', '', doc.title), element('small', '', doc.kind));
    button.append(icon, copy);
    button.addEventListener('click', () => openDoc(key));
    item.append(button);
    list.append(item);
  }
}
function setBusy(value){
  busy = value;
  sendButton.classList.toggle('stop', value);
  sendButton.setAttribute('aria-label', value ? 'Dừng trả lời' : 'Gửi câu hỏi');
  syncComposer();
}
function syncComposer(){ composer.classList.toggle('empty-input', !busy && !input.value.trim()); }
function resetSources(){
  readCount = 0;
  $('#source-list').innerHTML = '<li class="source-empty">Ghi chép được dùng trong câu trả lời sẽ hiện ở đây.</li>';
  $('#cited-count').textContent = '0';
}
function addSource(key, index){
  const doc = docs[key], list = $('#source-list');
  list.querySelector('.source-empty')?.remove();
  const item = element('li', 'source'), button = element('button');
  button.type = 'button';
  button.dataset.source = index;
  button.innerHTML = `<span class="num">${index}</span><span style="flex:1"><small></small><strong></strong></span>`;
  button.querySelector('small').textContent = doc.kind;
  button.querySelector('strong').textContent = doc.title;
  button.addEventListener('click', () => openDoc(key));
  item.append(button);
  list.append(item);
  $('#cited-count').textContent = list.children.length;
}
function openDoc(key){
  const doc = docs[key];
  $('#doc-kind').textContent = doc.kind;
  $('#doc-title').textContent = doc.title;
  $('#doc-meta').textContent = doc.meta;
  $('#doc-body').innerHTML = doc.body.map(line => `<p>${line}</p>`).join('');
  $('#doc-dialog').showModal();
}
const popover = $('#cite-pop');
function showCitation(chip, key){
  const doc = docs[key], quote = doc.body.find(line => line.startsWith('<mark>')) ?? doc.body[0];
  popover.innerHTML = '<small></small><strong></strong><p></p>';
  popover.querySelector('small').textContent = doc.kind;
  popover.querySelector('strong').textContent = doc.title;
  popover.querySelector('p').textContent = `“${quote.replace(/<\/?mark>/g, '')}”`;
  popover.hidden = false;
  const box = chip.getBoundingClientRect(), width = popover.offsetWidth, height = popover.offsetHeight;
  popover.style.left = `${Math.max(12, Math.min(box.left - width / 2 + box.width / 2, innerWidth - width - 12))}px`;
  popover.style.top = `${box.top - height - 8 < 50 ? box.bottom + 8 : box.top - height - 8}px`;
}
function citation(index, sources){
  const chip = element('button', 'cite', index), key = sources[index - 1];
  chip.type = 'button';
  chip.setAttribute('aria-label', `Nguồn ${index}: ${docs[key].title}`);
  chip.addEventListener('click', () => { popover.hidden = true; openDoc(key); });
  chip.addEventListener('mouseenter', () => showCitation(chip, key));
  chip.addEventListener('focus', () => showCitation(chip, key));
  chip.addEventListener('mouseleave', () => { popover.hidden = true; });
  chip.addEventListener('blur', () => { popover.hidden = true; });
  return chip;
}
async function streamInto(target, text, id, sources, delay = wordDelay){
  target.dataset.noTranslate = '';
  streams.set(target, { text, sources });
  const version = languageVersion;
  for (const part of localize(text).split(/(\[\d\])/)){
    const match = part.match(/^\[(\d)\]$/);
    if (match){ target.append(citation(Number(match[1]), sources)); continue; }
    for (const word of part.split(/(?<=\s)/)){
      if (id !== run) return false;
      if (version !== languageVersion) return true;
      target.insertAdjacentHTML('beforeend', window.portfolioIcons.text(word));
      scrollDown();
      await wait(delay);
    }
  }
  return id === run;
}
async function renderBlock(block, body, id, sources){
  if (block.p) return streamInto(body.appendChild(element('p')), block.p, id, sources);
  if (block.quote) return streamInto(body.appendChild(element('blockquote')), block.quote, id, sources);
  if (block.ul){
    const list = body.appendChild(element('ul'));
    for (const text of block.ul) if (!await streamInto(list.appendChild(element('li')), text, id, sources)) return false;
    return true;
  }
  const scroll = body.appendChild(element('div', 'table-scroll')), table = scroll.appendChild(element('table'));
  for (const [rowIndex, row] of block.table.entries()){
    const tr = table.appendChild(element('tr'));
    for (const cell of row) if (!await streamInto(tr.appendChild(element(rowIndex ? 'td' : 'th')), cell, id, sources)) return false;
  }
  return true;
}
function addUserMessage(text){
  emptyState.remove();
  chat.classList.add('started');
  const message = element('div', 'message user');
  message.dataset.noTranslate = '';
  message.append(element('p', '', text));
  thread.append(message);
}
async function ask(text){
  text = text.trim();
  if (!text || busy) return;
  const id = ++run;
  const folded = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  let candidates = scenarios;
  if (workspace === 'all'){
    const matches = [
      ['coffee', /\b(?:ca phe|goc nho|quan|caphe|cold brew|cafe|coffee)\b/],
      ['rental', /\b(?:nha|ben vuon|thue|phong|luu tru|wi-?fi|wifi|rental|house|guest|weekday)\b/],
      ['flowers', /\b(?:tiem hoa|hoa may|hoa|bo hoa|cam hoa|flower|flowers|bouquet|roses)\b/]
    ].filter(([,pattern]) => pattern.test(folded));
    if (matches.length === 1) candidates = scenarios.filter(item => item.sources.every(key => notes[key].business === matches[0][0]));
  }
  const asksForReply = /tra loi|soan|viet.*(?:khach|danh gia|tin nhan)|tin nhan.*khach|reply|draft|write.*(?:guest|review|message)/.test(folded);
  const englishKeys = {
    focus: /prioriti[sz]e|focus|first.*week|week.*first/,
    reply: /reply|draft|write/,
    weekdays: /weekday|booking|occupancy|more guests/,
    repairs: /repair|fix|wi-?fi|maintenance/,
    pricing: /cold brew|bottl|pricing|price/,
    money: /revenue|profit|expense|financ|money|left.*month|month.*left/,
    feedback: /feedback|review|wait|queue|improve/,
    flowerReply: /reply|draft|write|message/,
    flowerDelivery: /deliver|schedule|courier|overlap/,
    flowerStock: /stock|restock|need|enough|short/,
  };
  const scenario = candidates.find(item => item.prompt === text || localize(item.prompt) === text) ?? candidates.find(item => {
    const key = Object.keys(questions).find(key => questions[key] === item);
    return (!asksForReply || item.reply) && (item.keys.test(folded) || englishKeys[key]?.test(folded));
  });
  input.value = ''; resizeInput();
  addUserMessage(text);
  resetSources();
  setBusy(true);
  const message = element('article', 'message assistant'), body = element('div', 'answer streaming');
  message.setAttribute('aria-busy', 'true');
  message.setAttribute('aria-label', 'Pip');
  const heading = element('div', 'assistant-heading'), avatar = element('img', 'assistant-avatar'), identity = element('div');
  avatar.src = 'mascot.svg';
  avatar.alt = '';
  avatar.width = avatar.height = 38;
  identity.append(element('span', 'assistant-name', 'Pip'));
  heading.append(avatar, identity);
  message.append(heading);
  thread.append(message);
  let completed = true;
  if (scenario){
    const progress = element('p', 'answer-progress', 'Đang xem ghi chép của bạn…');
    identity.append(progress);
    for (const key of scenario.sources){
      await wait(380);
      if (id !== run){ completed = false; break; }
      progress.textContent = `Đang đọc “${docs[key].title}”…`;
      addSource(key, ++readCount);
      scrollDown();
    }
    progress.textContent = completed ? `Đã tham khảo ${readCount} ghi chép` : 'Đã tạm dừng';
    message.append(body);
    if (completed) for (const block of scenario.answer) if (!(completed = await renderBlock(block, body, id, scenario.sources))) break;
  } else {
    message.append(body);
    completed = await renderBlock(fallback, body, id, []);
    if (completed){ const row = body.appendChild(element('div', 'inline-suggestions')); workspaces[workspace].suggestions.forEach(key => row.append(suggestionButton(questions[key], 'suggestion small'))); }
  }
  body.classList.remove('streaming');
  message.removeAttribute('aria-busy');
  if (!completed) body.append(element('p', 'stopped', 'Đã dừng trả lời.'));
  if (completed && scenario) message.append(actions(text));
  if (id === run) setBusy(false);
  scrollDown();
  announce(completed ? 'Pip đã trả lời xong.' : 'Đã dừng trả lời.');
}
function iconButton(icon, label){
  const button = element('button');
  button.type = 'button';
  button.innerHTML = icons[icon];
  button.setAttribute('aria-label', label);
  button.title = label;
  return button;
}
function actions(prompt){
  const bar = element('div', 'actions');
  const copy = iconButton('copy', 'Sao chép câu trả lời'), retry = iconButton('retry', 'Trả lời lại');
  copy.addEventListener('click', async () => {
    const text = copy.closest('.message').querySelector('.answer').innerText;
    try { await navigator.clipboard.writeText(text); copy.title = 'Đã sao chép'; announce('Đã sao chép câu trả lời.'); } catch { announce('Chưa sao chép được. Bạn thử chọn và sao chép thủ công nhé.'); }
  });
  retry.addEventListener('click', () => ask(prompt));
  bar.append(copy, retry);
  return bar;
}
function stop(){ run++; setBusy(false); }
function resizeInput(){ input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 180)}px`; syncComposer(); }
function setSourceView(view){
  const library = view === 'library';
  $('#library-tab').setAttribute('aria-pressed', String(library));
  $('#cited-tab').setAttribute('aria-pressed', String(!library));
  $('#library-panel').hidden = !library;
  $('#cited-panel').hidden = library;
}
function toggleSources(open){
  const panel = $('#sources'), next = open ?? !panel.classList.contains('open');
  panel.hidden = !next;
  panel.classList.toggle('open', next);
  if (next) $('#sources-close').focus();
  else $('#sources-toggle').focus();
  popover.hidden = true;
  $('#sources-toggle').setAttribute('aria-expanded', String(next));
}
function newChat(){ setSourceView('library'); stop(); streams.clear(); toggleSources(false); chat.classList.remove('started'); thread.replaceChildren(emptyState); resetSources(); input.focus(); }
window.addEventListener('showcase-language', () => {
  languageVersion++;
  for (const [target, { text, sources }] of streams) {
    if (!target.isConnected) { streams.delete(target); continue; }
    target.replaceChildren();
    for (const part of localize(text).split(/(\[\d\])/)) {
      const match = part.match(/^\[(\d)\]$/);
      if (match) target.append(citation(Number(match[1]), sources));
      else target.insertAdjacentHTML('beforeend', window.portfolioIcons.text(part));
    }
  }
});
composer.addEventListener('submit', event => { event.preventDefault(); busy ? stop() : ask(input.value); });
input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing){ event.preventDefault(); if (!busy) ask(input.value); } });
input.addEventListener('input', resizeInput);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#doc-dialog').open && $('#sources').classList.contains('open')){ toggleSources(false); $('#sources-toggle').focus(); }
  if (event.key === 'k' && (event.metaKey || event.ctrlKey)){ event.preventDefault(); newChat(); }
});
$('#new-chat').addEventListener('click', newChat);
$('#sources-toggle').addEventListener('click', () => toggleSources());
$('#library-tab').addEventListener('click', () => setSourceView('library'));
$('#cited-tab').addEventListener('click', () => setSourceView('cited'));
$('#sources-close').addEventListener('click', () => toggleSources(false));
thread.addEventListener('scroll', () => { popover.hidden = true; });
renderWorkspaces();
setWorkspace(workspace);
syncComposer();
