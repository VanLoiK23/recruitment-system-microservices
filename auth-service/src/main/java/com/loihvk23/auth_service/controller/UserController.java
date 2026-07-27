package com.loihvk23.auth_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.auth_service.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController("userResController")
@RequiredArgsConstructor
@RequestMapping("/account/")
public class UserController {
	private final UserService userService;
}
