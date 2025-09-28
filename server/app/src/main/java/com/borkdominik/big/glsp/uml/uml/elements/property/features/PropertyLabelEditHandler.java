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
package com.borkdominik.big.glsp.uml.uml.elements.property.features;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.Property;

import com.borkdominik.big.glsp.server.core.constants.BGCoreTypes;
import com.borkdominik.big.glsp.server.core.features.direct_editing.label_edit.integrations.BGEMFLabelEdit;
import com.borkdominik.big.glsp.server.core.features.suffix.BGNameLabelSuffix;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityUtil;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PropertyLabelEditHandler<TElement extends Property> extends BGEMFLabelEdit<TElement> {
   @Inject
   public PropertyLabelEditHandler(@Assisted final Enumerator representation,
         @Assisted final Set<BGTypeProvider> handledElementTypes) {
      super(representation, handledElementTypes,
            Map.of(BGCoreTypes.LABEL_NAME,
                  List.of(BGNameLabelSuffix.SUFFIX),
                  UMLTypes.PROPERTY_MULTIPLICITY.prefix(representation),
                  List.of(PropertyMultiplicityLabelSuffix.SUFFIX)));
   }

   @Override
   public Command doHandle(final ApplyLabelEditOperation operation, final TElement element) {
      var argument = UMLUpdateElementCommand.Argument
            .<TElement>updateElementArgumentBuilder()
            .consumer(e -> {
               if (operation.getLabelId().endsWith(PropertyMultiplicityLabelSuffix.SUFFIX)) {
                  e.setUpper(MultiplicityUtil.getUpper(operation.getText()));
                  e.setLower(MultiplicityUtil.getLower(operation.getText()));
               } else {
                  e.setName(operation.getText());
               }
            })
            .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}
