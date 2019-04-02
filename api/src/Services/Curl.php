<?php

namespace App\Services;

class Curl
{
    private $curl;

    public function __construct()
    {
        $this->curl = curl_init();
    }

    public function initCurl($data)
    {
        curl_setopt_array($this->curl, [
            CURLOPT_URL => $data["url"],// "https://api.intra.42.fr/oauth/token",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $data["postfield"],// "{\n\t\"grant_type\": \"authorization_code\",\n\t\"client_id\": \"410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9\",\n\t\"client_secret\": \"0e156668ef0c973c8fa8526fc683f26ce42801788756de614a307eee406ce1b8\",\n\t\"redirect_uri\": \"https://hypertube.barthonet.ovh/oauth/42\",\n\t\"code\": \"a501a7e9943f12479806415b125dd27f5a6233cd061b8e2b882a4c7b093b8505\"\n}",
            CURLOPT_HTTPHEADER => ["content-type: application/json"]
        ]);
    }

    public function execRequest()
    {
        $response = curl_exec($curl);
        $err = curl_error($curl);
    
        curl_close($curl);
    
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            return $response;
        }
    }
}