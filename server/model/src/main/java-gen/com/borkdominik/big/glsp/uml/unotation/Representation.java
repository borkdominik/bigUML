/**
 * Copyright (c) 2024 borkdominik and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package com.borkdominik.big.glsp.uml.unotation;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.emf.common.util.Enumerator;

/**
 * <!-- begin-user-doc -->
 * A representation of the literals of the enumeration '<em><b>Representation</b></em>',
 * and utility methods for working with them.
 * <!-- end-user-doc -->
 * @see com.borkdominik.big.glsp.uml.unotation.UnotationPackage#getRepresentation()
 * @model
 * @generated
 */
public enum Representation implements Enumerator {
	/**
	 * The '<em><b>ACTIVITY</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #ACTIVITY_VALUE
	 * @generated
	 * @ordered
	 */
	ACTIVITY(0, "ACTIVITY", "ACTIVITY"),

	/**
	 * The '<em><b>CLASS</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CLASS_VALUE
	 * @generated
	 * @ordered
	 */
	CLASS(1, "CLASS", "CLASS"),

	/**
	 * The '<em><b>COMMUNICATION</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMMUNICATION_VALUE
	 * @generated
	 * @ordered
	 */
	COMMUNICATION(2, "COMMUNICATION", "COMMUNICATION"),

	/**
	 * The '<em><b>COMPONENT</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMPONENT_VALUE
	 * @generated
	 * @ordered
	 */
	COMPONENT(3, "COMPONENT", "COMPONENT"),

	/**
	 * The '<em><b>COMPOSITE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMPOSITE_VALUE
	 * @generated
	 * @ordered
	 */
	COMPOSITE(4, "COMPOSITE", "COMPOSITE"),

	/**
	 * The '<em><b>DEPLOYMENT</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #DEPLOYMENT_VALUE
	 * @generated
	 * @ordered
	 */
	DEPLOYMENT(5, "DEPLOYMENT", "DEPLOYMENT"),

	/**
	 * The '<em><b>INTERACTION</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #INTERACTION_VALUE
	 * @generated
	 * @ordered
	 */
	INTERACTION(6, "INTERACTION", "INTERACTION"),

	/**
	 * The '<em><b>OBJECT</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #OBJECT_VALUE
	 * @generated
	 * @ordered
	 */
	OBJECT(7, "OBJECT", "OBJECT"),

	/**
	 * The '<em><b>PACKAGE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #PACKAGE_VALUE
	 * @generated
	 * @ordered
	 */
	PACKAGE(8, "PACKAGE", "PACKAGE"),

	/**
	 * The '<em><b>PROFILE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #PROFILE_VALUE
	 * @generated
	 * @ordered
	 */
	PROFILE(9, "PROFILE", "PROFILE"),

	/**
	 * The '<em><b>SEQUENCE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #SEQUENCE_VALUE
	 * @generated
	 * @ordered
	 */
	SEQUENCE(10, "SEQUENCE", "SEQUENCE"),

	/**
	 * The '<em><b>STATE MACHINE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #STATE_MACHINE_VALUE
	 * @generated
	 * @ordered
	 */
	STATE_MACHINE(11, "STATE_MACHINE", "STATE_MACHINE"),

	/**
	 * The '<em><b>TIMING</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #TIMING_VALUE
	 * @generated
	 * @ordered
	 */
	TIMING(12, "TIMING", "TIMING"),

	/**
	 * The '<em><b>USE CASE</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #USE_CASE_VALUE
	 * @generated
	 * @ordered
	 */
	USE_CASE(13, "USE_CASE", "USE_CASE"),

	/**
	 * The '<em><b>INFORMATION FLOW</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #INFORMATION_FLOW_VALUE
	 * @generated
	 * @ordered
	 */
	INFORMATION_FLOW(14, "INFORMATION_FLOW", "INFORMATION_FLOW");

	/**
	 * The '<em><b>ACTIVITY</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #ACTIVITY
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int ACTIVITY_VALUE = 0;

	/**
	 * The '<em><b>CLASS</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CLASS
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int CLASS_VALUE = 1;

	/**
	 * The '<em><b>COMMUNICATION</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMMUNICATION
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int COMMUNICATION_VALUE = 2;

	/**
	 * The '<em><b>COMPONENT</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMPONENT
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int COMPONENT_VALUE = 3;

	/**
	 * The '<em><b>COMPOSITE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #COMPOSITE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int COMPOSITE_VALUE = 4;

	/**
	 * The '<em><b>DEPLOYMENT</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #DEPLOYMENT
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int DEPLOYMENT_VALUE = 5;

	/**
	 * The '<em><b>INTERACTION</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #INTERACTION
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int INTERACTION_VALUE = 6;

	/**
	 * The '<em><b>OBJECT</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #OBJECT
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int OBJECT_VALUE = 7;

	/**
	 * The '<em><b>PACKAGE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #PACKAGE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int PACKAGE_VALUE = 8;

	/**
	 * The '<em><b>PROFILE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #PROFILE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int PROFILE_VALUE = 9;

	/**
	 * The '<em><b>SEQUENCE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #SEQUENCE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int SEQUENCE_VALUE = 10;

	/**
	 * The '<em><b>STATE MACHINE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #STATE_MACHINE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int STATE_MACHINE_VALUE = 11;

	/**
	 * The '<em><b>TIMING</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #TIMING
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int TIMING_VALUE = 12;

	/**
	 * The '<em><b>USE CASE</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #USE_CASE
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int USE_CASE_VALUE = 13;

	/**
	 * The '<em><b>INFORMATION FLOW</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #INFORMATION_FLOW
	 * @model
	 * @generated
	 * @ordered
	 */
	public static final int INFORMATION_FLOW_VALUE = 14;

	/**
	 * An array of all the '<em><b>Representation</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static final Representation[] VALUES_ARRAY =
		new Representation[] {
			ACTIVITY,
			CLASS,
			COMMUNICATION,
			COMPONENT,
			COMPOSITE,
			DEPLOYMENT,
			INTERACTION,
			OBJECT,
			PACKAGE,
			PROFILE,
			SEQUENCE,
			STATE_MACHINE,
			TIMING,
			USE_CASE,
			INFORMATION_FLOW,
		};

	/**
	 * A public read-only list of all the '<em><b>Representation</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static final List<Representation> VALUES = Collections.unmodifiableList(Arrays.asList(VALUES_ARRAY));

	/**
	 * Returns the '<em><b>Representation</b></em>' literal with the specified literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param literal the literal.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static Representation get(String literal) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			Representation result = VALUES_ARRAY[i];
			if (result.toString().equals(literal)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Representation</b></em>' literal with the specified name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param name the name.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static Representation getByName(String name) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			Representation result = VALUES_ARRAY[i];
			if (result.getName().equals(name)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Representation</b></em>' literal with the specified integer value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the integer value.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static Representation get(int value) {
		switch (value) {
			case ACTIVITY_VALUE: return ACTIVITY;
			case CLASS_VALUE: return CLASS;
			case COMMUNICATION_VALUE: return COMMUNICATION;
			case COMPONENT_VALUE: return COMPONENT;
			case COMPOSITE_VALUE: return COMPOSITE;
			case DEPLOYMENT_VALUE: return DEPLOYMENT;
			case INTERACTION_VALUE: return INTERACTION;
			case OBJECT_VALUE: return OBJECT;
			case PACKAGE_VALUE: return PACKAGE;
			case PROFILE_VALUE: return PROFILE;
			case SEQUENCE_VALUE: return SEQUENCE;
			case STATE_MACHINE_VALUE: return STATE_MACHINE;
			case TIMING_VALUE: return TIMING;
			case USE_CASE_VALUE: return USE_CASE;
			case INFORMATION_FLOW_VALUE: return INFORMATION_FLOW;
		}
		return null;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final int value;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String name;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String literal;

	/**
	 * Only this class can construct instances.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private Representation(int value, String name, String literal) {
		this.value = value;
		this.name = name;
		this.literal = literal;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public int getValue() {
	  return value;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getName() {
	  return name;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getLiteral() {
	  return literal;
	}

	/**
	 * Returns the literal value of the enumerator, which is its string representation.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		return literal;
	}
	
} //Representation
