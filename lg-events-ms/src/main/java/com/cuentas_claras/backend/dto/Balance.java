package com.cuentas_claras.backend.dto;


public class Balance {
  private String userId;
  private Double balance;

  public Balance(String userId, Double balance) {
    this.userId = userId;
    this.balance = balance;
  }
  public String getUserId() { return userId; }
  public Double getBalance() { return balance; }
}
