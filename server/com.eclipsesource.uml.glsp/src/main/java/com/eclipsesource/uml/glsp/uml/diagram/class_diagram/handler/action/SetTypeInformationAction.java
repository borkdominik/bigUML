/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.action;

import java.util.Set;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.modelserver.core.models.TypeInformation;

public class SetTypeInformationAction extends ResponseAction {

   public static String TYPE = "setTypeInformation";

   private Set<TypeInformation> typeInformation;

   public SetTypeInformationAction() {
      super(TYPE);
   }

   public SetTypeInformationAction(final Set<TypeInformation> typeInformation) {
      super(TYPE);
      this.typeInformation = typeInformation;
   }

   public Set<TypeInformation> getTypeInformation() { return typeInformation; }

   public void setTypeInformation(final Set<TypeInformation> types) { this.typeInformation = types; }
}
