	.file	"lowlevel_read.c"
	.text
	.section	.rodata.str1.8,"aMS",@progbits,1
	.align 8
.LC0:
	.string	"/usr/share/dict/american-english"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
.LFB43:
	.cfi_startproc
	endbr64
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	xorl	%esi, %esi
	leaq	.LC0(%rip), %rdi
	pushq	%rbx
	.cfi_def_cfa_offset 24
	.cfi_offset 3, -24
	subq	$1048, %rsp
	.cfi_def_cfa_offset 1072
	movq	%fs:40, %rax
	movq	%rax, 1032(%rsp)
	xorl	%eax, %eax
	movq	%rsp, %rbx
	call	open@PLT
	movl	$1024, %edx
	movq	%rbx, %rsi
	movl	%eax, %edi
	call	read@PLT
	testl	%eax, %eax
	jle	.L2
	subl	$1, %eax
	leaq	1(%rsp,%rax), %rbp
	.p2align 4,,10
	.p2align 3
.L3:
	movsbl	(%rbx), %edi
	addq	$1, %rbx
	call	putchar@PLT
	cmpq	%rbp, %rbx
	jne	.L3
.L2:
	movq	1032(%rsp), %rax
	subq	%fs:40, %rax
	jne	.L8
	addq	$1048, %rsp
	.cfi_remember_state
	.cfi_def_cfa_offset 24
	xorl	%eax, %eax
	popq	%rbx
	.cfi_def_cfa_offset 16
	popq	%rbp
	.cfi_def_cfa_offset 8
	ret
.L8:
	.cfi_restore_state
	call	__stack_chk_fail@PLT
	.cfi_endproc
.LFE43:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0"
	.section	.note.GNU-stack,"",@progbits
	.section	.note.gnu.property,"a"
	.align 8
	.long	1f - 0f
	.long	4f - 1f
	.long	5
0:
	.string	"GNU"
1:
	.align 8
	.long	0xc0000002
	.long	3f - 2f
2:
	.long	0x3
3:
	.align 8
4:
