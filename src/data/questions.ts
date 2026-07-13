import type { Question } from "@/types/game";

export const questions: Question[] = [
  { id: "q001", benefit: "1億円もらえる", consequence: "一生Wi-Fiが1本になる", category: "お金", active: true },
  { id: "q002", benefit: "10歳若返る", consequence: "全員から10歳年上に見られる", category: "日常生活", active: true },
  { id: "q003", benefit: "空を飛べる", consequence: "地面から30cmまでしか上がれない", category: "能力", active: true },
  { id: "q004", benefit: "好きな食べ物が一生無料になる", consequence: "味が半分になる", category: "食べ物", active: true },
  { id: "q005", benefit: "未来を見られる", consequence: "見えるのは3秒先まで", category: "未来", active: true },
  { id: "q006", benefit: "どんな言語も話せる", consequence: "日本語を忘れる", category: "能力", active: true },
  { id: "q007", benefit: "一生働かなくてよくなる", consequence: "毎朝6時に強制起床する", category: "仕事", active: true },
  { id: "q008", benefit: "透明人間になれる", consequence: "透明な間はくしゃみが止まらない", category: "能力", active: true },
  { id: "q009", benefit: "100万円もらえる", consequence: "友達には1000万円入る", category: "友人関係", active: true },
  { id: "q010", benefit: "世界を救える", consequence: "誰にも気づかれない", category: "未来", active: true },
  { id: "q011", benefit: "好きな人と付き合える", consequence: "語尾が一生「にゃん」になる", category: "恋愛", active: true },
  { id: "q012", benefit: "一生風邪をひかない", consequence: "毎日どこかで小指をぶつける", category: "日常生活", active: true },
  { id: "q013", benefit: "どんなゲームでも最強になれる", consequence: "チュートリアルを絶対に飛ばせない", category: "日常生活", active: true },
  { id: "q014", benefit: "宝くじの当選番号がわかる", consequence: "番号を1つだけ忘れる", category: "お金", active: true },
  { id: "q015", benefit: "毎日8時間熟睡できる", consequence: "夢の中ではずっと仕事をする", category: "仕事", active: true },
  { id: "q016", benefit: "SNSのフォロワーが100万人になる", consequence: "投稿は毎回1文字だけ誤字になる", category: "SNS", active: true },
  { id: "q017", benefit: "毎週3連休になる", consequence: "休日の天気は必ず小雨になる", category: "仕事", active: true },
  { id: "q018", benefit: "食べても体重が増えなくなる", consequence: "ポテトはいつも1本だけ冷たい", category: "食べ物", active: true },
  { id: "q019", benefit: "人の心が読める", consequence: "相手にも自分の心が読まれる", category: "友人関係", active: true },
  { id: "q020", benefit: "どこへでも瞬間移動できる", consequence: "到着するたび靴下が左右逆になる", category: "能力", active: true },
  { id: "q021", benefit: "初対面の人に必ず好かれる", consequence: "親友には毎回名前を呼び間違えられる", category: "友人関係", active: true },
  { id: "q022", benefit: "好きな会社に必ず入れる", consequence: "社内BGMが自分にだけ2倍速で聞こえる", category: "仕事", active: true },
  { id: "q023", benefit: "一生スマホの充電が切れない", consequence: "画面の明るさが常に70%になる", category: "日常生活", active: true },
  { id: "q024", benefit: "投稿が毎回必ずバズる", consequence: "一番伸びるコメントは母親から届く", category: "SNS", active: true },
  { id: "q025", benefit: "理想のデートができる", consequence: "店内BGMがずっと自分の着信音になる", category: "恋愛", active: true },
  { id: "q026", benefit: "どんな料理も5分で作れる", consequence: "盛り付けだけは必ず少し傾く", category: "食べ物", active: true },
  { id: "q027", benefit: "明日の出来事が全部わかる", consequence: "今日の予定を全部忘れる", category: "未来", active: true },
  { id: "q028", benefit: "毎月自由に使える10万円が増える", consequence: "財布から小銭だけ毎回床に落ちる", category: "お金", active: true },
  { id: "q029", benefit: "写真写りが必ず完璧になる", consequence: "証明写真だけ毎回少し眠そうになる", category: "SNS", active: true },
  { id: "q030", benefit: "一生信号に引っかからない", consequence: "エレベーターは毎回すべての階に止まる", category: "くだらない代償", active: true },
];

export function getQuestionById(id: string) {
  return questions.find((question) => question.id === id && question.active);
}
