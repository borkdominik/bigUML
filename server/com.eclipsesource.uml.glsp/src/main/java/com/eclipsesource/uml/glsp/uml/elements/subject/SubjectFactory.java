/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.subject;

import com.eclipsesource.uml.glsp.uml.elements.subject.features.SubjectLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.subject.features.SubjectPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.subject.gmodel.SubjectNodeMapper;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface SubjectFactory extends NodeFactory {
   @Override
   SubjectConfiguration nodeConfiguration(Representation representation);

   @Override
   SubjectNodeMapper gmodel(Representation representation);

   @Override
   SubjectOperationHandler nodeOperationHandler(Representation representation);

   @Override
   SubjectLabelEditMapper labelEditMapper(Representation representation);

   @Override
   SubjectPropertyMapper elementPropertyMapper(Representation representation);
}
