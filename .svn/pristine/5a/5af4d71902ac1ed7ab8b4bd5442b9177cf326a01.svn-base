/**
 * 
 * 비밀번호 문자의 연속성 체크하여 boolean 타입으로 리턴
 *
 * @param password
 * @return boolean
 **/
function pwStraightChk(password) {

	var flag = false;
	var chr_pass_0;
	var chr_pass_1;
	var chr_pass_2;

	var pattern = /[!@#$%^&*]/gi
	for (var i = 0; i < password.length; i++)
	{
		if (i >= 2)
		{
			chr_pass_0 = password.charAt(i-2);
			chr_pass_1 = password.charAt(i-1);
			chr_pass_2 = password.charAt(i);

			// 현재 비교하는 문자 중 특수문자가 포함되어 있으면 판단 제외
			var isSp = false;
			var target =
			[
				chr_pass_0,
				chr_pass_1,
				chr_pass_2
			];
			for(var j=0; j<target.length; j++)
			{
				if(pattern.test(target[j]))
				{
					isSp = true;
					break;
				}
			}

			if(!isSp)
			{
				if (chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1)
				{
					flag = true;
					return flag;
				}

				if (chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1)
				{
					flag = true;
					return flag;
				}
			}
		}
	}
	return flag;
}