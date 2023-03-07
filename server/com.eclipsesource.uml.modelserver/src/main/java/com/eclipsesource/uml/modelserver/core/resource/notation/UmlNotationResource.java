/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.resource.notation;

import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.xmi.XMIResource;

import com.eclipsesource.uml.modelserver.unotation.util.UnotationResourceFactoryImpl;

public interface UmlNotationResource extends XMIResource {

   Resource.Factory FACTORY = new UnotationResourceFactoryImpl();

   String FILE_EXTENSION = "unotation";

}
