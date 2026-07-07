# Firebase Cloud Messaging (FCM) Setup

Este guia explica como configurar o Firebase Cloud Messaging (FCM) para notificações web no SeniorEase.

## Pré-requisitos

1. Projeto Firebase criado no [Firebase Console](https://console.firebase.google.com)
2. Credenciais do Firebase configuradas nas variáveis de ambiente (.env.local)

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao arquivo `.env.local`:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## Como Obter a VAPID Key

1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Acesse **Configurações do Projeto** → **Cloud Messaging**
4. Em **Certificados da Web**, clique em **Gerar Par de Chaves**
5. Copie a chave pública (VAPID Key)

## Arquivos Criados

### `/public/firebase-messaging-sw.js`

Service Worker que recebe mensagens em background. Precisa ser atualizado com as credenciais do Firebase.

### `/src/infrastructure/firebase/fcmConfig.ts`

Configuração do Firebase Messaging.

### `/src/infrastructure/firebase/fcmService.ts`

Serviços para:

- Requisitar permissão de notificação
- Obter token FCM do usuário
- Configurar listener de mensagens

### `/src/presentation/hooks/useNotifications.ts`

Hook que inicializa as notificações quando o usuário faz login.

### `/src/presentation/providers/FCMProvider.tsx`

Provider que registra o Service Worker.

## Como Usar

### 1. Enviar Notificação via Firebase Admin SDK

```python
from firebase_admin import messaging

message = messaging.Message(
    notification=messaging.Notification(
        title="Seu Lembrete",
        body="Hora de tomar o medicamento",
    ),
    data={
        "type": "reminder",
        "reminderId": "123",
    },
    token="user_fcm_token_here",
)

response = messaging.send(message)
print(f"Successfully sent message: {response}")
```

### 2. Enviar Notificação via Firebase Console

1. Vá para **Cloud Messaging** no Firebase Console
2. Clique em **Nova Campanha**
3. Selecione **Firebase Messaging**
4. Configure título, corpo e dados
5. Selecione público alvo (usuários com o app instalado)

## Próximos Passos

1. ✅ Implementar salvar o token FCM do usuário no Firestore
2. ✅ Criar backend API para enviar notificações
3. ✅ Implementar notificações para lembretes agendados
4. ✅ Configurar re-obtenção de token periodicamente

## Referências

- [Firebase Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Cloud Messaging Setup](https://firebase.google.com/docs/cloud-messaging/js/client)
