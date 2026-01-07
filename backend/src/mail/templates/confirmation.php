<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Cotización Recibida</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
        .header { background-color: #0056b3; color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Confirmación de Cotización Recibida</h2>
        </div>
        <div class="content">
            <p>Hola <strong><?= htmlspecialchars($name) ?></strong>,</p>
            <p>Hemos recibido tu solicitud de cotización:</p>
            <ul>
                <li><strong>ID:</strong> #<?= htmlspecialchars($submission['id']) ?></li>
                <?php if (!empty($submission['service_title'])): ?>
                    <li><strong>Servicio:</strong> <?= htmlspecialchars($submission['service_title']) ?></li>
                <?php endif; ?>
                <li><strong>Fecha:</strong> <?= (new DateTime($submission['created_at']))->format('d/m/Y H:i') ?></li>
            </ul>
            <h4>Datos enviados:</h4>
            <ul>
                <?php foreach ($submission['form_data'] as $field): ?>
                    <li><strong><?= htmlspecialchars($field['label']) ?>:</strong> <?= htmlspecialchars($field['value']) ?></li>
                <?php endforeach; ?>
            </ul>
            <p>Nos pondremos en contacto contigo a la brevedad.</p>
        </div>
        <div class="footer">
            <p>&copy; <?= date('Y') ?> <?= htmlspecialchars($this->mailConfig['from_name']) ?>.</p>
        </div>
    </div>
</body>
</html>

