<?php

namespace App\Services;

use App\Services\Curl;
use Symfony\Component\HttpFoundation\JsonResponse;

class Api42
{
    private $curl;
    private $url;
    private $client_id;
    private $client_secret;
    private $redirect_uri;

    public function __construct(Curl $curl)
    {
        $this->curl = $curl;

        $this->setUrl("https://api.intra.42.fr/oauth/token");
        $this->setClient_id("410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9");
        $this->setClient_secret("0e156668ef0c973c8fa8526fc683f26ce42801788756de614a307eee406ce1b8");
        $this->setRedirect_uri("https://hypertube.barthonet.ovh/oauth/42");
    }

    public function getToken(string $code)
    {
        $data = [
            "grant_type" => "authorization_code",
            "client_id" => $this->getClient_Id(),
            "client_secret" => $this->getClient_secret(),
            "redirect_uri" => $this->getRedirect_uri(),
            "code" => $code
        ];
        $resp = $this->curl->postJson($this->getUrl(), json_encode($data));
        $resp = json_decode($resp);

        return new JsonResponse(["api" => "42", "token" => $code, "code" => 200, "data" => $resp], 200);
    }

    public function setRedirect_uri(string $redirect_uri)
    {
        $this->redirect_uri = $redirect_uri;

        return $this;
    }

    public function getRedirect_uri(): string
    {
        return $this->redirect_uri;
    }

    public function setClient_secret(string $client_secret): self
    {
        $this->client_secret = $client_secret;

        return $this;
    }

    public function getClient_secret(): string
    {
        return $this->client_secret;
    }

    public function setClient_id(string $client_id): self
    {
        $this->client_id = $client_id;

        return $this;
    }

    public function getClient_Id(): string
    {
        return $this->client_id;
    }

    public function setUrl(string $url = null)
    {
        $this->url = $url;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }
}