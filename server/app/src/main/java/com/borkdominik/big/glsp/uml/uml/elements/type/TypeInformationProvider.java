/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.type;

import java.util.HashSet;
import java.util.Set;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Type;

import com.borkdominik.big.glsp.server.core.model.BGEMFModelState;
import com.borkdominik.big.glsp.uml.uml.elements.type.model.TypeInformation;
import com.google.inject.Inject;

public class TypeInformationProvider {
   @Inject
   protected BGEMFModelState modelState;
   @Inject
   protected EMFIdGenerator idGenerator;

   public Set<TypeInformation> provide() {
      var types = new HashSet<TypeInformation>();
      var resource = modelState.getSemanticModel().eResource();
      var contents = resource.getAllContents();
      var modelUri = resource.getURI();

      while (contents.hasNext()) {
         var res = contents.next();
         if (res instanceof Type) {
            var type = (Type) res;
            var simpleName = type.getClass().getSimpleName().replace("Impl", "");
            var name = type.getName() == null || type.getName().isBlank() ? simpleName : type.getName();

            types.add(TypeInformation.builder()
               .id(idGenerator.getOrCreateId(type))
               .modelUri(modelUri.toString())
               .name(name)
               .type(simpleName)
               .build());
         }
      }

      return types;
   }
}
