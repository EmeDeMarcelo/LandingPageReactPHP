<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Cotización de Servicio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
        .header { background-color: #28a745; color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
        .price { font-size: 2em; color: #28a745; font-weight: bold; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Tu Cotización de Servicio</h2>
        </div>
        <div class="content">
            <p>Hola <strong><?= htmlspecialchars($name) ?></strong>,</p>
            <p>Adjuntamos la cotización solicitada:</p>
            <ul>
                <li><strong>ID:</strong> #<?= htmlspecialchars($submission['id']) ?></li>
                <li><strong>Servicio:</strong> <?= htmlspecialchars($submission['service_title'] ?? 'N/A') ?></li>
                <li><strong>Fecha:</strong> <?= (new DateTime($submission['created_at']))->format('d/m/Y H:i') ?></li>
            </ul>
            <h4>Datos enviados:</h4>
            <ul>
                <?php foreach ($submission['form_data'] as $field): ?>
                    <li><strong><?= htmlspecialchars($field['label']) ?>:</strong> <?= htmlspecialchars($field['value']) ?></li>
                <?php endforeach; ?>
            </ul>
            <p class="price">Precio Cotizado: $<?= number_format($price, 0, ',', '.') ?> CLP</p>
            <?php if ($message): ?>
                <p><strong>Mensaje:</strong> <?= nl2br(htmlspecialchars($message)) ?></p>
            <?php endif; ?>
            <p>Gracias por tu interés. Quedamos atentos.</p>
            <p><strong><?= htmlspecialchars($this->mailConfig['from_name']) ?></strong></p>
            <p>Email: <a href="mailto:<?= htmlspecialchars($fromEmail) ?>"><?= htmlspecialchars($fromEmail) ?></a></p>
        </div>
        <div class="footer">
            <p>&copy; <?= date('Y') ?> <?= htmlspecialchars($this->mailConfig['from_name']) ?>.</p>
        </div>
    </div>
</body>
</html>

