  <?php
$responseArray = [
            'version' => '1.0',
            'response' => [
                  'outputSpeech' => [
                        'type' => 'PlainText',
                        'text' => 'hallo hier ist deine fact zu lübeck.',
                        'ssml' => null
                  ],
                  'shouldEndSession' => true
            ]
      ];



header ( 'Content-Type: application/json' );
echo json_encode ( $responseArray );

?>
