package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.LoginRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.HashSet;
import java.util.Set;

public class JwtService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = new UserRepo.findByID(username);
        if(user != null){
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    getAuthority(user)
            );
        }else{
            throw new UsernameNotFoundException("User not found");
        }
    }
    private Set getAuthority(User user){
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        for(Role role : user.getRole()){
            authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getRoleName()));
        }
        return authorities;
    }

    public Response createJWTToken(LoginRequest loginRequest){
        return jwtService.createJwtToken(LoginRequest);
    }
    String userName = loginRequest.getUsername();
    String userPassword = logingRequest.getPassword();
    authenticate(username,userPassword);

    private vid authenticate(String)
}
