<?php

namespace App\Services;

class Curl
{
    private $curl;

    public function __construct()
    {
        $this->curl = curl_init();
    }

    public function initPostCurl($url, $data)
    {
        curl_setopt_array(
            $this->curl,
            [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => ["content-type: application/json"]
            ]
        );
    }

    public function initGetCurl(string $url, string $token = null)
    {
        curl_setopt_array($this->curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "",
            CURLOPT_HTTPHEADER => ["Authorization: Bearer $token"]
        ]);
    }

    public function getData($url, $token)
    {
        $this->initGetCurl($url, $token);

        $response = curl_exec($this->curl);
        $err = curl_error($this->curl);

        curl_close($this->curl);
        return $this->returnResponse($err, $response);
    }

    public function postJson($url, $data)
    {
        $this->initPostCurl($url, $data);
        $response = curl_exec($this->curl);
        $err = curl_error($this->curl);
    
        curl_close($this->curl);
        return $this->returnResponse($err, $response);
    }

    public function returnResponse($err, $response)
    {
        if ($err) {
            return ["code" => 400, "resp" => "cURL Error #:" . $err];
        } else {
            return ["code" => 200, "resp" => $response];
        }
    }
}