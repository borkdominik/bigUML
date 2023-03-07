/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.resource.notation;

import java.util.Collection;
import java.util.List;

import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;

import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;

public class UmlNotationPackageConfiguration implements EPackageConfiguration {

   @Override
   public String getId() { return UnotationPackage.eINSTANCE.getNsURI(); }

   @Override
   public Collection<String> getFileExtensions() { return List.of(UmlNotationResource.FILE_EXTENSION); }

   @Override
   public void registerEPackage() {
      UnotationPackage.eINSTANCE.eClass();
   }

}
