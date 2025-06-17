package com.cuentas_claras.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DefaultController {
    @GetMapping
    @ResponseStatus(code = HttpStatus.OK)
    public Map<String, String> welcome() {
        HashMap<String, String> map = new HashMap<>();
        map.put("status", "OK");
        map.put("message", "REST API for cuentas claras lg-community-mg is running");
        return map;
    }
}
