# Cron Configuration

## Current Schedule

Автоматичне створення статей налаштовано на:

- **5:00 за Києвом** (2:00 UTC)
- **11:00 за Києвом** (8:00 UTC)

Розклад у vercel.json: `"schedule": "0 2,8 * * *"`

## Testing Locally

Для тестування крону локально:

1. Запустіть dev server:

```bash
npm run dev
```

1. У новому терміналі запустіть тест:

```bash
npm run test-cron
```

## Production Monitoring

Для перевірки роботи на продакшн:

- Перевірте Vercel Dashboard > Functions > Cron Jobs
- Подивіться логи функції у Vercel Dashboard
- Перевірте нові статті у блозі на <https://fais.world/blog>

## Manual Trigger

Можна запустити генерацію статті вручну через API:

```bash
curl "https://fais.world/api/cron/simple-article-generation?cron_secret=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI"
```

## Security

Cron endpoints захищені секретним ключем (`cron_secret`). API для створення статей захищено admin аутентифікацією та внутрішнім API ключем.
