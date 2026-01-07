<?php
/**
 * Servicio de envío de correos (confirmación y cotización)
 */

require_once __DIR__ . '/../../config/mail.php';
require_once __DIR__ . '/../../config/database.php';

// Cargar PHPMailer
$phpmailerPath = __DIR__ . '/../../PHPMailer/src/PHPMailer.php';
if (!file_exists($phpmailerPath)) {
    $phpmailerPath = __DIR__ . '/../../vendor/phpmailer/phpmailer/src/PHPMailer.php';
}

if (!file_exists($phpmailerPath)) {
    throw new Exception('PHPMailer no encontrado. Instala PHPMailer en backend/PHPMailer/ o backend/vendor/phpmailer/phpmailer/');
}

require_once $phpmailerPath;
require_once dirname($phpmailerPath) . '/SMTP.php';
require_once dirname($phpmailerPath) . '/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    private $pdo;
    private $mailConfig;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
        $this->mailConfig = require __DIR__ . '/../../config/mail.php';
    }

    private function configureMailer()
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $this->mailConfig['host'];
        $mail->SMTPAuth = $this->mailConfig['auth'];
        $mail->Username = $this->mailConfig['username'];
        $mail->Password = $this->mailConfig['password'];
        $mail->SMTPSecure = $this->mailConfig['secure'];
        $mail->Port = $this->mailConfig['port'];
        $mail->CharSet = 'UTF-8';

        if (isset($this->mailConfig['smtp_options'])) {
            $mail->SMTPOptions = $this->mailConfig['smtp_options'];
        }

        $mail->setFrom($this->mailConfig['from_email'], $this->mailConfig['from_name']);

        return $mail;
    }

    private function getSubmissionData($submissionId)
    {
        $stmt = $this->pdo->prepare("
            SELECT
                cs.id,
                cs.form_id,
                cf.name AS form_name,
                cf.version AS form_version,
                cs.service_id,
                s.title AS service_title,
                cs.status,
                cs.ip_address,
                cs.user_agent,
                cs.notes,
                cs.created_at,
                cs.updated_at,
                cs.quoted_price,
                cs.quoted_at,
                cs.email_confirmation_sent,
                cs.email_quote_sent,
                cs.email_confirmation_sent_at,
                cs.email_quote_sent_at
            FROM contact_submissions cs
            JOIN contact_forms cf ON cs.form_id = cf.id
            LEFT JOIN services s ON cs.service_id = s.id
            WHERE cs.id = ?
        ");
        $stmt->execute([$submissionId]);
        $submission = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$submission) {
            throw new Exception("Envío #$submissionId no encontrado.");
        }

        $stmtData = $this->pdo->prepare("
            SELECT
                csd.field_value,
                cff.field_name,
                cff.field_label,
                cff.field_type
            FROM contact_submission_data csd
            JOIN contact_form_fields cff ON csd.field_id = cff.id
            WHERE csd.submission_id = ?
            ORDER BY cff.position ASC
        ");
        $stmtData->execute([$submissionId]);
        $submissionData = $stmtData->fetchAll(PDO::FETCH_ASSOC);

        $formatted = [];
        foreach ($submissionData as $item) {
            $formatted[$item['field_name']] = [
                'label' => $item['field_label'],
                'type' => $item['field_type'],
                'value' => $item['field_value']
            ];
        }
        $submission['form_data'] = $formatted;

        return $submission;
    }

    private function buildConfirmationTemplate($submission, $name, $fromEmail)
    {
        $templatePath = __DIR__ . '/templates/confirmation.php';
        if (!file_exists($templatePath)) {
            return "<h1>Confirmación de Cotización Recibida</h1>
                    <p>Hola $name,</p>
                    <p>Hemos recibido tu solicitud de cotización con ID: #{$submission['id']}.</p>
                    <p>Nos pondremos en contacto contigo a la brevedad.</p>
                    <p>{$this->mailConfig['from_name']}</p>";
        }
        ob_start();
        include $templatePath;
        return ob_get_clean();
    }

    private function buildQuoteTemplate($submission, $name, $price, $message, $fromEmail)
    {
        $templatePath = __DIR__ . '/templates/quote.php';
        if (!file_exists($templatePath)) {
            return "<h1>Tu Cotización de Servicio</h1>
                    <p>Hola $name,</p>
                    <p><strong>Servicio:</strong> " . ($submission['service_title'] ?? 'N/A') . "</p>
                    <p><strong>Precio:</strong> $" . number_format($price, 2, ',', '.') . " CLP</p>
                    <p><strong>Mensaje:</strong> " . ($message ?? 'N/A') . "</p>
                    <p>{$this->mailConfig['from_name']}</p>";
        }
        ob_start();
        include $templatePath;
        return ob_get_clean();
    }

    public function sendConfirmation($submissionId)
    {
        try {
            $submission = $this->getSubmissionData($submissionId);

            $email = null;
            foreach ($submission['form_data'] as $fieldName => $fieldData) {
                if (stripos($fieldName, 'email') !== false || stripos($fieldData['label'], 'email') !== false || stripos($fieldData['label'], 'correo') !== false) {
                    $email = $fieldData['value'];
                    break;
                }
            }
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("No se encontró email válido en el envío");
            }

            $name = 'Estimado/a cliente';
            foreach ($submission['form_data'] as $fieldName => $fieldData) {
                if (stripos($fieldName, 'name') === 0 || stripos($fieldName, 'nombre') === 0 || stripos($fieldData['label'], 'nombre') !== false) {
                    $name = $fieldData['value'];
                    break;
                }
            }

            $mail = $this->configureMailer();
            $mail->addAddress($email, $name);
            $mail->isHTML(true);
            $mail->Subject = "Cotización recibida - #{$submissionId}";

            $fromEmail = $this->mailConfig['from_email'];
            $html = $this->buildConfirmationTemplate($submission, $name, $fromEmail);
            $mail->Body = $html;
            $mail->AltBody = strip_tags($html);
            $mail->send();

            $stmt = $this->pdo->prepare("
                UPDATE contact_submissions
                SET email_confirmation_sent = 1, email_confirmation_sent_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$submissionId]);
            return true;
        } catch (Exception $e) {
            error_log("Error enviando correo de confirmación: " . $e->getMessage());
            return false;
        }
    }

    public function sendQuote($submissionId, $price, $message = null)
    {
        $submission = $this->getSubmissionData($submissionId);

        $email = null;
        foreach ($submission['form_data'] as $fieldName => $fieldData) {
            if (stripos($fieldName, 'email') !== false || stripos($fieldData['label'], 'email') !== false || stripos($fieldData['label'], 'correo') !== false) {
                $email = $fieldData['value'];
                break;
            }
        }
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("No se encontró email válido en el envío");
        }

        $name = 'Estimado/a cliente';
        foreach ($submission['form_data'] as $fieldName => $fieldData) {
            if (stripos($fieldName, 'name') === 0 || stripos($fieldName, 'nombre') === 0 || stripos($fieldData['label'], 'nombre') !== false) {
                $name = $fieldData['value'];
                break;
            }
        }

        $mail = $this->configureMailer();
        $mail->addAddress($email, $name);
        $mail->isHTML(true);
        $mail->Subject = "Cotización - " . ($submission['service_title'] ?? 'Servicio') . " - #{$submissionId}";

        $fromEmail = $this->mailConfig['from_email'];
        $html = $this->buildQuoteTemplate($submission, $name, $price, $message, $fromEmail);
        $mail->Body = $html;
        $mail->AltBody = strip_tags($html);
        $mail->send();

        $stmt = $this->pdo->prepare("
            UPDATE contact_submissions
            SET status = 'quoted',
                quoted_price = ?,
                quoted_at = NOW(),
                email_quote_sent = 1,
                email_quote_sent_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$price, $submissionId]);
        return true;
    }
}

