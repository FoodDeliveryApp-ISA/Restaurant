package com.ISA.Restaurant.controller;

import org.springframework.web.bind.annotation.PostMapping;

public class LoginController {
    @PostMapping("/login")
    public String login(){
        return "login";
    }
}
