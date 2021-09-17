Devise.setup do |config|
  # ==> Configuration for :lockable
  # Defines which strategy will be used to lock an account.
  # :failed_attempts = Locks an account after a number of failed attempts to sign in.
  # :none            = No lock strategy. You should handle locking by yourself.
  # アカウントロック機能を使用するか
  config.lock_strategy = :failed_attempts

  # Defines which key will be used when locking and unlocking an account
  # ロック、アンロックに使用するキー項目を指定（今回は独自に追加した項目を指定）
  config.unlock_keys = [:user_id]

  # Defines which strategy will be used to unlock an account.
  # :email = Sends an unlock link to the user email
  # :time  = Re-enables login after a certain amount of time (see :unlock_in below)
  # :both  = Enables both strategies
  # :none  = No unlock strategy. You should handle unlocking by yourself.
  # アンロックする方法を選択（今回は一定時間経過するとアンロックするよう設定）
  config.unlock_strategy = :time

  # Number of authentication tries before locking an account if lock_strategy
  # is failed attempts.
  # アカウントロックまでの試行回数を設定
  config.maximum_attempts = 5

  # Time interval to unlock the account if :time is enabled as unlock_strategy.
  # アカウントをアンロックする時間を設定
  config.unlock_in = 1.minutes

  # Warn on the last attempt before the account is locked.
  # アカウントロック前の最後の試行で警告するか選択（今回は警告ありを設定）
  config.last_attempt_warning = true
end
