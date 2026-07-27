"""Gera INSTRUCOES_AVALIACAO.pdf para o projeto SeniorEase Web."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import os

# ── Cores ────────────────────────────────────────────────────────────────────
BRAND_BLUE   = HexColor("#1A3C5E")
BRAND_TEAL   = HexColor("#2A7F8F")
ACCENT_GOLD  = HexColor("#F59E0B")
LIGHT_BG     = HexColor("#F0F7FA")
DARK_TEXT    = HexColor("#1F2937")
MID_TEXT     = HexColor("#4B5563")
CODE_BG      = HexColor("#1E293B")
CODE_FG      = HexColor("#E2E8F0")
WARN_BG      = HexColor("#FEF3C7")
WARN_BORDER  = HexColor("#D97706")
SUCCESS_BG   = HexColor("#ECFDF5")
SUCCESS_BDR  = HexColor("#059669")
SECTION_LINE = HexColor("#CBD5E1")

# ── Página ───────────────────────────────────────────────────────────────────
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "INSTRUCOES_AVALIACAO.pdf")

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=14*mm, bottomMargin=14*mm,
    title="SeniorEase Web — Instruções de Avaliação",
    author="SeniorEase Team",
)

W = A4[0] - 36*mm   # largura útil

# ── Estilos ──────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, **kw)

S_HERO_TITLE = style("HeroTitle",
    fontSize=22, leading=28, textColor=white,
    fontName="Helvetica-Bold", alignment=TA_CENTER)

S_HERO_SUB = style("HeroSub",
    fontSize=11, leading=16, textColor=HexColor("#B0D8E8"),
    fontName="Helvetica", alignment=TA_CENTER)

S_SECTION = style("Section",
    fontSize=9, leading=11, textColor=BRAND_TEAL,
    fontName="Helvetica-Bold", spaceAfter=4,
    spaceBefore=10, letterSpacing=1.2)

S_BODY = style("Body",
    fontSize=9.5, leading=14, textColor=DARK_TEXT,
    fontName="Helvetica")

S_BODY_SMALL = style("BodySmall",
    fontSize=8.5, leading=12, textColor=MID_TEXT,
    fontName="Helvetica")

S_CODE = style("Code",
    fontSize=8.5, leading=13, textColor=CODE_FG,
    fontName="Courier", backColor=CODE_BG,
    leftIndent=6, rightIndent=6,
    borderPadding=(4, 6, 4, 6))

S_CODE_KEY = style("CodeKey",
    fontSize=8, leading=12, textColor=HexColor("#7DD3FC"),
    fontName="Courier-Bold")

S_CODE_VAL = style("CodeVal",
    fontSize=8, leading=12, textColor=HexColor("#86EFAC"),
    fontName="Courier")

S_WARN = style("Warn",
    fontSize=9, leading=13, textColor=HexColor("#92400E"),
    fontName="Helvetica-Bold")

S_WARN_BODY = style("WarnBody",
    fontSize=9, leading=13, textColor=HexColor("#78350F"),
    fontName="Helvetica")

S_OK_BODY = style("OkBody",
    fontSize=9, leading=13, textColor=HexColor("#065F46"),
    fontName="Helvetica")

S_STEP_NUM = style("StepNum",
    fontSize=13, leading=16, textColor=white,
    fontName="Helvetica-Bold", alignment=TA_CENTER)

S_STEP_TITLE = style("StepTitle",
    fontSize=10, leading=14, textColor=BRAND_BLUE,
    fontName="Helvetica-Bold")

S_STEP_BODY = style("StepBody",
    fontSize=9, leading=13, textColor=DARK_TEXT,
    fontName="Helvetica")

S_LINK = style("Link",
    fontSize=9, leading=13, textColor=BRAND_TEAL,
    fontName="Helvetica")

S_FOOTER = style("Footer",
    fontSize=7.5, leading=10, textColor=HexColor("#94A3B8"),
    fontName="Helvetica", alignment=TA_CENTER)

S_TABLE_HDR = style("TblHdr",
    fontSize=8.5, leading=11, textColor=white,
    fontName="Helvetica-Bold", alignment=TA_CENTER)

S_TABLE_CEL = style("TblCell",
    fontSize=8.5, leading=11, textColor=DARK_TEXT,
    fontName="Helvetica")

S_TABLE_CEL_MONO = style("TblCellMono",
    fontSize=8, leading=11, textColor=DARK_TEXT,
    fontName="Courier")

# ── Helpers ──────────────────────────────────────────────────────────────────
def spacer(h=4):
    return Spacer(1, h*mm)

def hrule(color=SECTION_LINE, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=2*mm, spaceBefore=2*mm)

def section_header(label):
    return [
        Spacer(1, 3*mm),
        Paragraph(label.upper(), S_SECTION),
        HRFlowable(width="100%", thickness=1, color=BRAND_TEAL,
                   spaceAfter=3*mm, spaceBefore=0),
    ]

def hero_block():
    data = [[Paragraph("SE  SeniorEase Web — Instruções de Avaliação", S_HERO_TITLE)],
            [Paragraph("Hackathon FIAP 2026 · Módulo Web (Next.js 16) · Projeto seniorease-backend", S_HERO_SUB)]]
    tbl = Table(data, colWidths=[W])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), BRAND_BLUE),
        ("TOPPADDING",  (0,0), (-1, 0), 10),
        ("BOTTOMPADDING",(0,0),(-1,-1), 10),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING",(0,0), (-1,-1), 8),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return [tbl, spacer(5)]

def links_table():
    rows = [
        [Paragraph("RECURSO", S_TABLE_HDR), Paragraph("LINK", S_TABLE_HDR)],
        [Paragraph("Repositório Web", S_TABLE_CEL),
         Paragraph('<link href="https://github.com/deytt/seniorease-web" color="#2A7F8F">github.com/deytt/seniorease-web</link>', S_LINK)],
        [Paragraph("Repositório Mobile", S_TABLE_CEL),
         Paragraph('<link href="https://github.com/deytt/seniorease-mobile" color="#2A7F8F">github.com/deytt/seniorease-mobile</link>', S_LINK)],
        [Paragraph("App Web (Vercel)", S_TABLE_CEL),
         Paragraph('<link href="https://seniorease-web.vercel.app" color="#2A7F8F">seniorease-web.vercel.app</link>', S_LINK)],
        [Paragraph("Figma Design", S_TABLE_CEL),
         Paragraph('<link href="https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase" color="#2A7F8F">figma.com/design/SeniorEase</link>', S_LINK)],
        [Paragraph("Protótipo Publicado", S_TABLE_CEL),
         Paragraph('<link href="https://senior-ease.figma.site" color="#2A7F8F">senior-ease.figma.site</link>', S_LINK)],
        [Paragraph("Kanban do Projeto", S_TABLE_CEL),
         Paragraph('<link href="https://github.com/users/deytt/projects/3" color="#2A7F8F">github.com/users/deytt/projects/3</link>', S_LINK)],
    ]
    col1 = W * 0.28
    col2 = W * 0.72
    tbl = Table(rows, colWidths=[col1, col2])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), BRAND_BLUE),
        ("BACKGROUND",    (0,1), (-1,1), LIGHT_BG),
        ("BACKGROUND",    (0,2), (-1,2), white),
        ("BACKGROUND",    (0,3), (-1,3), LIGHT_BG),
        ("BACKGROUND",    (0,4), (-1,4), white),
        ("BACKGROUND",    (0,5), (-1,5), LIGHT_BG),
        ("BACKGROUND",    (0,6), (-1,6), white),
        ("GRID",          (0,0), (-1,-1), 0.4, SECTION_LINE),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 7),
        ("RIGHTPADDING",  (0,0), (-1,-1), 7),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ]))
    return tbl

def warning_box(title, lines):
    body = "<br/>".join(lines)
    data = [
        [Paragraph(f"⚠  {title}", S_WARN)],
        [Paragraph(body, S_WARN_BODY)],
    ]
    tbl = Table(data, colWidths=[W])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",     (0,0), (-1,-1), WARN_BG),
        ("LINEABOVE",      (0,0), (-1,0),  2, WARN_BORDER),
        ("LINEBEFORE",     (0,0), (0,-1),  2, WARN_BORDER),
        ("LINEAFTER",      (0,0), (0,-1),  0.5, WARN_BORDER),
        ("LINEBELOW",      (0,-1),(-1,-1), 0.5, WARN_BORDER),
        ("TOPPADDING",     (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",  (0,0), (-1,-1), 5),
        ("LEFTPADDING",    (0,0), (-1,-1), 8),
        ("RIGHTPADDING",   (0,0), (-1,-1), 8),
    ]))
    return tbl

def success_box(title, lines):
    body = "<br/>".join(lines)
    data = [
        [Paragraph(f"✓  {title}", style("OkTitle",
            fontSize=9, leading=13, textColor=HexColor("#065F46"),
            fontName="Helvetica-Bold"))],
        [Paragraph(body, S_OK_BODY)],
    ]
    tbl = Table(data, colWidths=[W])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), SUCCESS_BG),
        ("LINEABOVE",     (0,0), (-1,0),  2, SUCCESS_BDR),
        ("LINEBEFORE",    (0,0), (0,-1),  2, SUCCESS_BDR),
        ("LINEAFTER",     (0,0), (0,-1),  0.5, SUCCESS_BDR),
        ("LINEBELOW",     (0,-1),(-1,-1), 0.5, SUCCESS_BDR),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
    ]))
    return tbl

def step_block(num, title, body_lines):
    num_cell = Table([[Paragraph(str(num), S_STEP_NUM)]], colWidths=[8*mm])
    num_cell.setStyle(TableStyle([
        ("BACKGROUND",     (0,0), (-1,-1), BRAND_TEAL),
        ("TOPPADDING",     (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",  (0,0), (-1,-1), 3),
        ("LEFTPADDING",    (0,0), (-1,-1), 1),
        ("RIGHTPADDING",   (0,0), (-1,-1), 1),
        ("ROUNDEDCORNERS", [4]),
    ]))
    body_html = "<br/>".join(body_lines)
    content = Table([
        [Paragraph(title, S_STEP_TITLE)],
        [Paragraph(body_html, S_STEP_BODY)],
    ], colWidths=[W - 12*mm])
    content.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 2),
        ("BOTTOMPADDING", (0,0), (-1,-1), 2),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    outer = Table([[num_cell, content]], colWidths=[10*mm, W - 10*mm])
    outer.setStyle(TableStyle([
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    return outer

def env_table():
    """Tabela com as variáveis de ambiente (valores reais)."""
    rows = [
        [Paragraph("VARIÁVEL", S_TABLE_HDR),
         Paragraph("VALOR", S_TABLE_HDR),
         Paragraph("USO", S_TABLE_HDR)],
        ["NEXT_PUBLIC_FIREBASE_API_KEY",
         "AIzaSyAmTfxf98WSZI_lG7-FV9bP7OGas7wVJFs",
         "Firebase Web SDK"],
        ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
         "seniorease-backend.firebaseapp.com",
         "Autenticação"],
        ["NEXT_PUBLIC_FIREBASE_PROJECT_ID",
         "seniorease-backend",
         "ID do Projeto"],
        ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
         "seniorease-backend.firebasestorage.app",
         "Storage (foto de perfil)"],
        ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
         "98401811269",
         "FCM (notificações)"],
        ["NEXT_PUBLIC_FIREBASE_APP_ID",
         "1:98401811269:web:01f7003482fabdde625c2c",
         "App Web"],
        ["NEXT_PUBLIC_FIREBASE_VAPID_KEY",
         "BDriePnvz1ICc4jGyRjhUl7RY-uygHPUBD6nak1Nu\nojVh0O7KEKmMViScCE3hKMW3TMH2Qpa7U9umHDz7lBiOa8",
         "Push Web (FCM)"],
    ]
    col_w = [W * 0.38, W * 0.40, W * 0.22]
    tbl_rows = [rows[0]]
    for i, r in enumerate(rows[1:]):
        tbl_rows.append([
            Paragraph(r[0], S_TABLE_CEL_MONO),
            Paragraph(r[1], S_TABLE_CEL_MONO),
            Paragraph(r[2], S_TABLE_CEL),
        ])
    tbl = Table(tbl_rows, colWidths=col_w)
    style_cmds = [
        ("BACKGROUND",    (0,0), (-1,0),  BRAND_BLUE),
        ("GRID",          (0,0), (-1,-1), 0.4, SECTION_LINE),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 5),
        ("RIGHTPADDING",  (0,0), (-1,-1), 5),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("WORDWRAP",      (0,0), (-1,-1), True),
    ]
    for i in range(1, len(tbl_rows)):
        if i % 2 == 1:
            style_cmds.append(("BACKGROUND", (0,i), (-1,i), LIGHT_BG))
        else:
            style_cmds.append(("BACKGROUND", (0,i), (-1,i), white))
    tbl.setStyle(TableStyle(style_cmds))
    return tbl

def screens_table():
    rows = [
        [Paragraph("#", S_TABLE_HDR),
         Paragraph("TELA", S_TABLE_HDR),
         Paragraph("ROTA", S_TABLE_HDR)],
        *[
            [Paragraph(str(n), S_TABLE_CEL),
             Paragraph(t, S_TABLE_CEL),
             Paragraph(r, S_TABLE_CEL_MONO)]
            for n, t, r in [
                (1,  "Login",               "/login"),
                (2,  "Registro",             "/register"),
                (3,  "Esqueci a senha",      "/forgot-password"),
                (4,  "Tela de sucesso",      "/success"),
                (5,  "Dashboard",            "/dashboard"),
                (6,  "Central de Acessibilidade", "/accessibility"),
                (7,  "Lista de Tarefas",     "/tasks"),
                (8,  "Detalhes da Tarefa",   "/tasks/[id]"),
                (9,  "Criar Tarefa",         "/tasks/create"),
                (10, "Modo Guiado",          "/tasks/[id]/guided"),
                (11, "Central de Lembretes", "/reminders"),
                (12, "Histórico",            "/history"),
                (13, "Perfil",               "/profile"),
            ]
        ]
    ]
    col_w = [W * 0.08, W * 0.52, W * 0.40]
    tbl = Table(rows, colWidths=col_w)
    style_cmds = [
        ("BACKGROUND",    (0,0), (-1,0), BRAND_BLUE),
        ("GRID",          (0,0), (-1,-1), 0.4, SECTION_LINE),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
    ]
    for i in range(1, len(rows)):
        bg = LIGHT_BG if i % 2 == 1 else white
        style_cmds.append(("BACKGROUND", (0,i), (-1,i), bg))
    tbl.setStyle(TableStyle(style_cmds))
    return tbl

# ── Conteúdo ─────────────────────────────────────────────────────────────────
story = []

# Hero
story += hero_block()

# ── REPOSITÓRIOS E LINKS ──────────────────────────────────────────────────────
story += section_header("Repositórios e Links")
story.append(links_table())
story.append(spacer(4))

# ── AVISO ─────────────────────────────────────────────────────────────────────
story += section_header("Variáveis de Ambiente — Credenciais Firebase")
story.append(
    warning_box(
        "Estas credenciais dão acesso ao Firebase do projeto seniorease-backend.",
        [
            "Não compartilhe publicamente.",
            "Use-as apenas para executar e avaliar o projeto localmente.",
            "Após a avaliação, não é necessário manter o arquivo .env.local.",
        ]
    )
)
story.append(spacer(3))
story.append(Paragraph(
    "Copie os valores abaixo para o arquivo <font name='Courier'>.env.local</font> na raiz do projeto:",
    S_BODY
))
story.append(spacer(3))
story.append(env_table())
story.append(spacer(4))

# ── PRÉ-REQUISITOS ────────────────────────────────────────────────────────────
story += section_header("Pré-requisitos")

prereqs = [
    ["Node.js 20+", "nodejs.org/download — versão LTS recomendada"],
    ["npm 10+",     "Incluído com o Node.js (npm --version para verificar)"],
    ["Git",         "git-scm.com (necessário para clonar o repositório)"],
]
col_w2 = [W * 0.28, W * 0.72]
prereq_rows = [
    [Paragraph("FERRAMENTA", S_TABLE_HDR), Paragraph("OBSERVAÇÃO", S_TABLE_HDR)],
    *[[Paragraph(p[0], S_TABLE_CEL), Paragraph(p[1], S_TABLE_CEL)] for p in prereqs]
]
tbl_pre = Table(prereq_rows, colWidths=col_w2)
tbl_pre.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,0), BRAND_BLUE),
    ("BACKGROUND",    (0,1), (-1,1), LIGHT_BG),
    ("BACKGROUND",    (0,2), (-1,2), white),
    ("BACKGROUND",    (0,3), (-1,3), LIGHT_BG),
    ("GRID",          (0,0), (-1,-1), 0.4, SECTION_LINE),
    ("TOPPADDING",    (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING",   (0,0), (-1,-1), 7),
    ("RIGHTPADDING",  (0,0), (-1,-1), 7),
]))
story.append(tbl_pre)
story.append(spacer(4))

# ── PASSO A PASSO ─────────────────────────────────────────────────────────────
story += section_header("Passo a Passo")

steps = [
    (
        1, "Clonar o repositório",
        [
            "<font name='Courier'>git clone --recurse-submodules https://github.com/deytt/seniorease-web.git</font>",
            "<font name='Courier'>cd seniorease-web</font>",
            "",
            "Se já clonou sem submódulo:",
            "<font name='Courier'>git submodule update --init --recursive</font>",
        ]
    ),
    (
        2, "Instalar dependências",
        ["<font name='Courier'>npm install</font>"]
    ),
    (
        3, "Criar o arquivo de variáveis de ambiente",
        [
            "<font name='Courier'>cp .env.example .env.local</font>",
            "",
            "Em seguida abra <font name='Courier'>.env.local</font> e preencha com os valores da tabela acima.",
            "O arquivo ficará assim:",
            "",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_API_KEY</font><font name='Courier'>=AIzaSyAmTfxf98WSZI_lG7-FV9bP7OGas7wVJFs</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</font><font name='Courier'>=seniorease-backend.firebaseapp.com</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_PROJECT_ID</font><font name='Courier'>=seniorease-backend</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</font><font name='Courier'>=seniorease-backend.firebasestorage.app</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</font><font name='Courier'>=98401811269</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_APP_ID</font><font name='Courier'>=1:98401811269:web:01f7003482fabdde625c2c</font>",
            "<font name='Courier' color='#7DD3FC'>NEXT_PUBLIC_FIREBASE_VAPID_KEY</font><font name='Courier'>=BDriePnvz1ICc4jGyRjhUl7RY-uygHPUBD6nak1NuojVh0O7KEKmMViScCE3hKMW3TMH2Qpa7U9umHDz7lBiOa8</font>",
        ]
    ),
    (
        4, "Executar o servidor de desenvolvimento",
        [
            "<font name='Courier'>npm run dev</font>",
            "",
            "Acesse: <font name='Courier' color='#2A7F8F'>http://localhost:3000</font>",
        ]
    ),
    (
        5, "Criar uma conta",
        [
            "Na tela de Login (/login) clique em <b>\"Criar conta\"</b> e registre-se com e-mail e senha.",
            "Os dados são gravados no Firestore do projeto <font name='Courier'>seniorease-backend</font>.",
        ]
    ),
]

for num, title, lines in steps:
    story.append(step_block(num, title, lines))
    story.append(spacer(2))

story.append(spacer(2))

# ── TELAS IMPLEMENTADAS ───────────────────────────────────────────────────────
story += section_header("Telas Implementadas (13 / 13)")
story.append(screens_table())
story.append(spacer(4))

# ── VALIDAÇÃO ─────────────────────────────────────────────────────────────────
story += section_header("Validação (Opcional)")

val_rows = [
    [Paragraph("COMANDO", S_TABLE_HDR), Paragraph("O QUE VERIFICA", S_TABLE_HDR), Paragraph("RESULTADO ESPERADO", S_TABLE_HDR)],
    [Paragraph("npm run lint",       S_TABLE_CEL_MONO),
     Paragraph("ESLint",             S_TABLE_CEL),
     Paragraph("0 erros",            S_TABLE_CEL)],
    [Paragraph("npm run type-check", S_TABLE_CEL_MONO),
     Paragraph("TypeScript",         S_TABLE_CEL),
     Paragraph("0 erros",            S_TABLE_CEL)],
    [Paragraph("npm test",           S_TABLE_CEL_MONO),
     Paragraph("120 testes Vitest",  S_TABLE_CEL),
     Paragraph("120 passed",         S_TABLE_CEL)],
    [Paragraph("npm run build",      S_TABLE_CEL_MONO),
     Paragraph("Build de produção",  S_TABLE_CEL),
     Paragraph("Build succeeded",    S_TABLE_CEL)],
    [Paragraph("npm run storybook",  S_TABLE_CEL_MONO),
     Paragraph("19 stories — Design System",  S_TABLE_CEL),
     Paragraph("Abre em http://localhost:6006", S_TABLE_CEL)],
]
col_w3 = [W * 0.30, W * 0.38, W * 0.32]
tbl_val = Table(val_rows, colWidths=col_w3)
val_style = [
    ("BACKGROUND",    (0,0), (-1,0), BRAND_BLUE),
    ("GRID",          (0,0), (-1,-1), 0.4, SECTION_LINE),
    ("TOPPADDING",    (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ("RIGHTPADDING",  (0,0), (-1,-1), 6),
]
for i in range(1, len(val_rows)):
    bg = LIGHT_BG if i % 2 == 1 else white
    val_style.append(("BACKGROUND", (0,i), (-1,i), bg))
tbl_val.setStyle(TableStyle(val_style))
story.append(tbl_val)
story.append(spacer(4))

# ── OBSERVAÇÕES ───────────────────────────────────────────────────────────────
story += section_header("Observações")

obs = [
    "• A aplicação requer conexão com a internet para autenticação e sincronização via Firestore.",
    "• Notificações push funcionam apenas em navegadores que suportam Service Workers (Chrome, Edge, Firefox).",
    "  Para testá-las, execute via <font name='Courier'>npm run build &amp;&amp; npm start</font> ou acesse o deploy em <font name='Courier'>seniorease-web.vercel.app</font>.",
    "• No primeiro acesso ao Dashboard, a lista estará vazia — use o botão <b>\"Carregar exemplos\"</b>",
    "  para popular dados de demonstração no Firestore.",
    "• O <b>Modo Básico / Avançado</b> e os controles de acessibilidade ficam em <font name='Courier'>/accessibility</font>.",
    "• O projeto inclui um <b>Memory Bank</b> como submódulo Git em <font name='Courier'>memory-bank/</font> com toda a documentação",
    "  de arquitetura, schema Firestore e decisões de design.",
]
for line in obs:
    story.append(Paragraph(line, S_BODY_SMALL))
    story.append(spacer(1))

story.append(spacer(5))

# ── DEPLOY VERCEL ─────────────────────────────────────────────────────────────
story.append(
    success_box(
        "Deploy disponível — avalie sem instalar nada",
        [
            "O projeto está disponível em produção em: seniorease-web.vercel.app",
            "Crie uma conta diretamente no app para testar todas as funcionalidades sem precisar rodar localmente.",
        ]
    )
)

story.append(spacer(6))

# Rodapé
story.append(hrule())
story.append(Paragraph(
    "SeniorEase · Hackathon FIAP 2026 · Plataforma de inclusão digital para idosos",
    S_FOOTER
))

# ── Build ─────────────────────────────────────────────────────────────────────
doc.build(story)
print(f"PDF gerado em: {OUTPUT_PATH}")
